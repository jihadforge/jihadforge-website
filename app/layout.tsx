import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "./CartProvider";
import Navbar from "./components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JihadForge | Built With Purpose",
  description:
    "Premium modest performance wear built for discipline, strength, and purpose.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>

        <Script
          src="https://static.klaviyo.com/onsite/js/WSgfcM/klaviyo.js?company_id=WSgfcM"
          strategy="afterInteractive"
        />

        <Script id="klaviyo-init" strategy="afterInteractive">
          {`
            !function(){
              if(!window.klaviyo){
                window._klOnsite = window._klOnsite || [];
                try{
                  window.klaviyo = new Proxy({},{
                    get:function(n,i){
                      return "push"===i
                        ? function(){
                            var n;
                            (n=window._klOnsite).push.apply(n,arguments);
                          }
                        : function(){
                            for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];
                            var t="function"==typeof o[o.length-1]?o.pop():void 0;
                            return new Promise(function(resolve){
                              window._klOnsite.push([i].concat(o,[function(result){
                                t&&t(result);
                                resolve(result);
                              }]));
                            });
                          };
                    }
                  });
                }catch(e){
                  window.klaviyo = window.klaviyo || [];
                  window.klaviyo.push = function(){
                    var n;
                    (n=window._klOnsite).push.apply(n,arguments);
                  };
                }
              }
            }();
          `}
        </Script>
      </body>
    </html>
  );
}