import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { NavHref } from "@/components/NavHref";
import { siteConfig } from "@/config/site";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: "YouTube",
    href: siteConfig.social.youtube,
    icon: Youtube,
    className:
      "bg-[#FF0000] shadow-red-900/30 hover:bg-[#e60000] hover:shadow-red-500/40",
  },
  {
    name: "Instagram",
    href: siteConfig.social.instagram,
    icon: Instagram,
    className:
      "bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] shadow-pink-900/30 hover:brightness-110 hover:shadow-pink-500/40",
  },
  {
    name: "Facebook",
    href: siteConfig.social.facebook,
    icon: Facebook,
    className:
      "bg-[#1877F2] shadow-blue-900/30 hover:bg-[#166fe5] hover:shadow-blue-500/40",
  },
  {
    name: "LinkedIn",
    href: siteConfig.social.linkedin,
    icon: Linkedin,
    className:
      "bg-[#0A66C2] shadow-blue-900/30 hover:bg-[#0958a8] hover:shadow-blue-500/40",
  },
  {
    name: "TikTok",
    href: siteConfig.social.tiktok,
    icon: TikTokIcon,
    className:
      "bg-[#010101] shadow-black/30 hover:bg-[#1a1a1a] hover:shadow-black/40",
  },
  {
    name: "Pinterest",
    href: siteConfig.social.pinterest,
    icon: PinterestIcon,
    className:
      "bg-[#E60023] shadow-red-900/30 hover:bg-[#cc001f] hover:shadow-red-500/40",
  },
] as const;

export function SocialLinks() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <NavHref
            key={social.name}
            href={social.href}
            external
            className={`group flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${social.className}`}
          >
            <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="sr-only">{social.name}</span>
          </NavHref>
        );
      })}
    </div>
  );
}
