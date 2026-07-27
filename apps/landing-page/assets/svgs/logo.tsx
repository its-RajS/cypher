"use client";

const Logo = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <div className="w-full flex items-center">
            <svg
                viewBox="0 0 420 120"
                className="w-[80%] h-auto max-w-44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                {...props}
            >
                {/* Icon outer ring */}
                <circle 
                    cx="60"
                    cy="60"
                    r="42"
                    stroke="white"
                    strokeWidth="8"
                />

                {/* Cyber cut lines */}
                <path
                    d="M30 60H16"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <path
                    d="M104 60H90"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <path
                    d="M60 30V16"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <path
                    d="M60 104V90"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                />

                {/* Play button */}
                <path
                    d="M52 43.5C52 40.8 55 39.2 57.2 40.7L79.5 56.2C82 57.9 82 62.1 79.5 63.8L57.2 79.3C55 80.8 52 79.2 52 76.5V43.5Z"
                    fill="white"
                />

                {/* Wordmark */}
                <text
                    x="125"
                    y="78"
                    fill="white"
                    fontSize="58"
                    fontWeight="800"
                    fontFamily="Inter, Arial, sans-serif"
                    letterSpacing="2"
                >
                    CYPHER
                </text>
            </svg>
        </div>
    );
};

export default Logo;