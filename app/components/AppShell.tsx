"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { CartProvider } from "../CartProvider";
import Navbar from "./Navbar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/login";

  // Admin and login pages do not use the storefront navbar,
  // shopping cart, or Klaviyo popup.
  if (isAdminPage || isLoginPage) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Navbar />

      {children}

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
                          for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)
                            o[w]=arguments[w];

                          var t="function"==typeof o[o.length-1]
                            ? o.pop()
                            : void 0;

                          return new Promise(function(resolve){
                            window._klOnsite.push([
                              i,
                              ...o,
                              function(result){
                                t&&t(result);
                                resolve(result);
                              }
                            ]);
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
    </CartProvider>
  );
}