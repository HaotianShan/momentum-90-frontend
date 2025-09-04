import { FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "Our Mission", href: "#" },
        { name: "Careers & Culture", href: "#" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { name: "Healthcare", href: "#" },
        { name: "E-commerce", href: "#" },
        { name: "SaaS", href: "#" },
        { name: "EdTech", href: "#" },
        { name: "Real Estate", href: "#" },
        { name: "Travel & Hospitality", href: "#" },
        { name: "Gaming & Esports", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Customer Business Agreement", href: "#" },
        { name: "Security", href: "#" },
        { name: "Accessibility", href: "#" },
      ],
    },
    {
      title: "Learn More",
      links: [
        { name: "Pricing", href: "#" },
        { name: "Generative AI", href: "#" },
        { name: "Agentic AI", href: "#" },
        { name: "Why choose us", href: "#" },
      ],
    },
    {
      title: "Connect",
      links: [
        { name: "Contact Us", href: "#" },
        {
          name: "Instagram",
          href: "#",
          icon: <FaInstagram className="inline mr-2" />,
        },
        {
          name: "X / Twitter",
          href: "#",
          icon: <FaTwitter className="inline mr-2" />,
        },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-7 gap-10">
          {/* Brand Column */}

          <Link href="/">
            <div className="font-bold text-3xl whitespace-nowrap min-w-[120px] flex items-center">
              <span
                style={{
                  fontFamily: "Roboto, sans-serif",
                  color: "#FC7B11",
                  fontWeight: 700,
                  fontSize: "2.4rem",
                  lineHeight: 1,
                }}
              >
                &Sigma;
              </span>
              <span
                className="ml-0.5"
                style={{ fontFamily: "geist, sans-serif" }}
              >
                lle AI
              </span>
            </div>
          </Link>

          {/* Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-lg font-semibold text-white tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center transition-colors hover:text-white group"
                    >
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-12" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Elle AI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaInstagram className="size-5" />
            </a>
            <a
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTwitter className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
