"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, Analytics01Icon, AnalyticsUpIcon, ArrowRight01Icon, BookTextIcon, CheckmarkCircle03Icon, ChevronRightIcon, UserCircleIcon, Clock03Icon, CreditCardIcon, CrownIcon, DashboardSquare01Icon, Delete02Icon, Download03Icon, EyeIcon, EyeOffIcon, ExternalLinkIcon, FileVideoIcon, Folder02Icon, GlobeIcon, GraduationCapIcon, HardDriveIcon, HelpCircleIcon, Image01Icon, LayoutGridIcon, LifebuoyIcon, Logout01Icon, Menu02Icon, MoonIcon, PanelLeftCloseIcon, PanelLeftIcon, PencilEdit02Icon, PlaySquareIcon, PlusSignIcon, Refresh01Icon, Search01Icon, ServerStack01Icon, Settings01Icon, Shield01Icon, SlidersHorizontalIcon, Sun01Icon, Upload03Icon, UserIcon, Video02Icon, Cancel01Icon, ZapIcon } from "@hugeicons/core-free-icons";
import type * as React from "react";
type IconProps = Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">;
type IconDefinition = React.ComponentProps<typeof HugeiconsIcon>["icon"];
function createIcon(icon: IconDefinition) { return function DashboardIcon({ size = 20, ...props }: IconProps) { return <HugeiconsIcon icon={icon} size={size} {...props} />; }; }
export const AlertTriangle=createIcon(Alert02Icon), AreaChart=createIcon(Analytics01Icon), ArrowRight=createIcon(ArrowRight01Icon), BookText=createIcon(BookTextIcon), Check=createIcon(CheckmarkCircle03Icon), ChevronRight=createIcon(ChevronRightIcon), CircleUser=createIcon(UserCircleIcon), Clock=createIcon(Clock03Icon), CreditCard=createIcon(CreditCardIcon), Crown=createIcon(CrownIcon), Dashboard=createIcon(DashboardSquare01Icon), Delete=createIcon(Delete02Icon), Download=createIcon(Download03Icon), Edit3=createIcon(PencilEdit02Icon), Eye=createIcon(EyeIcon), EyeOff=createIcon(EyeOffIcon), ExternalLink=createIcon(ExternalLinkIcon), FileVideo=createIcon(FileVideoIcon), FolderKanban=createIcon(Folder02Icon), Globe=createIcon(GlobeIcon), GraduationCap=createIcon(GraduationCapIcon), HardDrive=createIcon(HardDriveIcon), HelpCircle=createIcon(HelpCircleIcon), Image=createIcon(Image01Icon), LayoutDashboard=createIcon(DashboardSquare01Icon), LayoutGrid=createIcon(LayoutGridIcon), LifeBuoy=createIcon(LifebuoyIcon), LogOut=createIcon(Logout01Icon), Menu=createIcon(Menu02Icon), Moon=createIcon(MoonIcon), PanelLeftClose=createIcon(PanelLeftCloseIcon), PanelLeftOpen=createIcon(PanelLeftIcon), Pencil=createIcon(PencilEdit02Icon), PlaySquare=createIcon(PlaySquareIcon), Plus=createIcon(PlusSignIcon), RefreshCcw=createIcon(Refresh01Icon), Search=createIcon(Search01Icon), Server=createIcon(ServerStack01Icon), Settings=createIcon(Settings01Icon), ShieldCheck=createIcon(Shield01Icon), Sliders=createIcon(SlidersHorizontalIcon), Sun=createIcon(Sun01Icon), Trash2=createIcon(Delete02Icon), TrendingUp=createIcon(AnalyticsUpIcon), UploadCloud=createIcon(Upload03Icon), User=createIcon(UserIcon), Users=createIcon(UserIcon), Video=createIcon(Video02Icon), X=createIcon(Cancel01Icon), Zap=createIcon(ZapIcon);

export const Activity = AreaChart;
export const BookOpen = BookText;
export const Calendar = Clock;
export const ChevronDown = ChevronRight;
export const Code2 = FileVideo;
export const Copy = FileVideo;
export const FileQuestion = HelpCircle;
export const FileText = BookText;
export const FolderOpen = FolderKanban;
export const ImageIcon = Image;
export const Mail = HelpCircle;
export const MessageCircle = HelpCircle;
export const MoveUpRight = ArrowRight;
export const PieChart = AreaChart;
export const Play = PlaySquare;
export const PlayCircle = PlaySquare;
export const ScrollText = BookText;
export const Tag = BookText;
export const VideoIcon = Video;
