import { Courgette, Poppins } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const courgette = Courgette({ subsets: ["latin"], weight: ["400"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: "Portal del Paciente",
  description: "Sistema de agendamiento médico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={poppins.className}>
        {children}
        {/* Chat disponible en todas las páginas */}
        <ChatWidget />
      </body>
    </html>
  );
}



// import { Courgette, Poppins } from "next/font/google";
// import "./globals.css";

// const courgette = Courgette({ subsets: ["latin"], weight: ["400"] });
// const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

// export const metadata = {
//   title: "Portal del Paciente",
//   description: "Sistema de agendamiento médico",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="es">
//       {/* Poppins como fuente base */}
//       <body className={poppins.className}>{children}</body>
//     </html>
//   );
// }
