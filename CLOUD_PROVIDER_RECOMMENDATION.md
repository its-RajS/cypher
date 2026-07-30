# Cloud Provider Recommendation for Cypher

## Decision

Migrate the video pipeline from OneMinuteCloud storage to **Bunny Stream**.

Bunny Stream is the best budget-oriented fit for Cypher's intended business model: a multi-tenant video hosting product that needs to preserve margin on storage and playback allowances. It provides managed video upload, transcoding, adaptive streaming, CDN delivery, a player, signed/resumable uploads, and a REST API, so it replaces more than just object storage.

## Why Bunny Stream

- Standard encoding is free; the premium encoding tier is optional. Bunny Stream lists premium 1080p/720p encoding at $0.05 per input minute, but its standard encoding is advertised as free. [Bunny Stream pricing](https://docs.bunny.net/stream/pricing), [Bunny Stream overview](https://bunny.net/lp-stream/)
- Storage starts at $0.01/GB/month in the default Frankfurt region. Extra replication costs $0.01/GB for the second region and $0.005/GB for each additional region. [Bunny Stream pricing](https://docs.bunny.net/stream/pricing)
- Delivery costs $0.01/GB in Europe/North America and $0.03/GB in Asia/Oceania on the standard network; the volume network starts at $0.005/GB. [Bunny Stream pricing](https://docs.bunny.net/stream/pricing)
- It supports a direct, resumable TUS upload flow. The backend creates a video object and signs a short-lived upload; the browser uploads straight to Bunny without exposing the account API key. [Bunny TUS uploads](https://docs.bunny.net/stream/tus-resumable-uploads)
- Its Stream API covers video management, uploads, embeds, collections, and webhooks. [Bunny Stream API](https://docs.bunny.net/api-reference/stream)

## Why not Cloudflare Stream as the default

Cloudflare Stream is the runner-up for the simplest platform operations: direct creator uploads, free ingress and encoding, adaptive delivery, signed URLs, and no separate bandwidth fee. [Cloudflare Stream overview](https://developers.cloudflare.com/stream/), [direct creator uploads](https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/)

Its pricing is $5 per 1,000 stored video minutes and $1 per 1,000 delivered minutes. [Cloudflare Stream pricing](https://developers.cloudflare.com/stream/pricing/)

That is excellent for a playback-heavy product with a small library. It is a poor margin fit for Cypher's advertised 250 GB, 600 GB, and 2 TB storage allowances because storage is charged by duration, not bytes. For example, 10,000 stored minutes plus 10,000 delivered minutes is $60/month before database, auth, support, and payment costs.

## Why not Mux as the default

Mux is the best developer experience and includes 100,000 free delivery minutes/month, free basic input, security controls, and strong analytics. [Mux pricing](https://www.mux.com/pricing), [Mux pricing guide](https://www.mux.com/docs/pricing/video)

However, 1080p basic storage starts at $0.003 per stored minute/month. A 10,000-minute library is therefore about $30/month in storage before other operating costs, which is too high for Cypher's current Starter price.

## Margin model using Bunny Stream

This is a conservative illustration, not a billing promise:

- Assume the average 720p viewer receives 1.5 Mbps, or roughly 0.011 GB per delivered minute.
- Assume the audience is primarily in Asia/Oceania, Bunny's $0.03/GB standard delivery region.
- Assume adaptive renditions make stored footage consume roughly 2x the source-file allowance. Bunny notes that each enabled rendition, MP4 fallback, and original-file retention can increase stored size. [Bunny encoding](https://docs.bunny.net/stream/encoding), [Bunny storage behavior](https://support.bunny.net/hc/en-us/articles/360020493180-Understanding-Bunny-Stream-Storage)

| Plan shown on landing page | Allowance | Illustrative Bunny cost | Current price | Approx. gross margin before platform costs |
| --- | --- | ---: | ---: | ---: |
| Starter | 250 GB + 10,000 delivered minutes | $8.30 | $14.99 | 45% |
| Pro | 600 GB + 22,000 delivered minutes | $19.25 | $29.99 | 36% |
| Business | 2 TB + 50,000 delivered minutes | $57.46 | $69.99 | 18% |

The Business tier is too thin once Neon, Redis, Clerk, transaction fees, support, and higher-bitrate or multi-region traffic are included. Either raise it to roughly $99/month, lower its storage allowance, or meter overage. Do not sell raw source-file GB as the storage allowance: meter the actual encoded footprint or reserve a 2x internal storage multiplier.

## Required product decisions before migration

1. Select one plan table as the source of truth. The landing page advertises 250 GB / 600 GB / 2 TB tiers, while the backend has different limits.
2. Define the billing region mix. Asia/Oceania delivery is three times Europe/North America on Bunny's standard network.
3. Decide whether original files and MP4 fallbacks are retained. Both increase storage consumption.
4. Decide the expected resolutions: 720p-only is far cheaper and a sensible Free/Starter default; make 1080p and 4K paid entitlements.
5. Add an overage policy before enabling self-serve paid plans.

## Migration shape

1. Replace `@oneminutecloud/storage-bucket` in the Nest service with a small Bunny Stream client.
2. Replace the existing direct storage upload UI with TUS: request a signed upload session from the Nest API, then upload directly from the dashboard to Bunny.
3. Store Bunny's `videoId`, library ID, playback URL, processing status, and thumbnail in `video_metadata`.
4. Receive Bunny webhooks to transition `PENDING` -> `PROCESSING` -> `SUCCESS`/`FAILED`, then update usage atomically.
5. Use Bunny signed-token playback for private videos and expose an embed/player URL from Cypher.
6. Implement video listing, deletion, and analytics sync so the dashboard stops using mock data.

## Important repository issues to resolve alongside the migration

- The dashboard currently bypasses the backend upload endpoint and uploads only the selected video directly; it does not persist the metadata or thumbnail.
- The upload guard checks quotas, but the current upload path does not reserve or increment storage usage.
- The provider change requires a Bunny account, a Stream library ID, and a server-only API key. Do not put the Bunny API key in `NEXT_PUBLIC_*` variables.

## Revised self-serve plan catalog

The initial public plan limits were internally inconsistent: the backend enforced 100 GB/15,000 minutes for Starter, 500 GB/50,000 for Pro, and 2 TB/200,000 for Enterprise, while the landing and billing pages showed different tiers. The revised catalog is:

| Tier | Monthly price | Persistent storage | Playback minutes/month | API keys | Playlists |
| --- | ---: | ---: | ---: | ---: | ---: |
| Free | $0 | 5 GB | 1,000 | 1 | 3 |
| Starter | $15 | 250 GB | 10,000 | 3 | 10 |
| Pro | $39 | 600 GB | 30,000 | 10 | 50 |
| Business | $99 | 1 TB | 75,000 | 20 | 100 |

### Unit-economics assumptions

The prices assume Bunny Stream Volume delivery for standard on-demand video, 2x the source-file size for encoded storage, and a blended 1.5 Mbps viewer bitrate. Bunny documents a $0.01/GB default storage price and a Volume delivery price of $5/TB; its Standard network is region-priced and should be an Enterprise upgrade, not the baseline cost model. [Bunny Stream pricing](https://docs.bunny.net/stream/pricing) and [Bunny Stream delivery tiers](https://docs.bunny.net/stream/storage-tiers).

At full allowance, the estimated core video costs are roughly $0.16, $5.55, $13.65, and $24.60 respectively. This leaves about 63% to 75% gross margin before payment, application, and support costs. The model is intentionally conservative about storage and should be reviewed against production bitrate and audience data each quarter.

### Metered features

Do not bundle unlimited transcription or DRM. Bunny charges $0.10 per language-minute for transcription and $99/month plus per-license charges for DRM. Price caption credits at $0.20/minute/language and sell DRM as an Enterprise quote. [Bunny Stream pricing](https://docs.bunny.net/stream/pricing). Mux Data is optional QoE analytics: 100,000 monthly views are free, then the listed pay-as-you-go rate is $0.60 per 1,000 views. [Mux Data pricing](https://data.mux.com/pricing).

### Enforcement status

The backend now centralizes quota and API-key/playlist limits in `PLAN_CATALOG`; new usage rows are seeded from the user tier rather than from Free. Playback-minute metering, resolution enforcement, private-playback tokens, watermarking, analytics exports, captions, and billing/overage collection still need implementation before their public feature claims are enabled.
