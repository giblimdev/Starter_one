"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import TableRelations from "./TableRelation";

export default function UserSchemaDiagram() {
  const [schema, setSchema] = useState<string>("// Chargement...");
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    // Charger schema.prisma.txt
    fetch("/schema.prisma.txt")
      .then((res) => res.text())
      .then(setSchema)
      .catch(() =>
        setSchema("// ❌ Erreur de chargement du fichier schema.prisma.txt")
      );

    // Charger le SVG
    fetch("/schema-diagram.svg")
      .then((res) => res.text())
      .then(setSvgContent)
      .catch(() =>
        setSvgContent(
          '<p class="text-red-600">❌ Erreur de chargement du diagramme SVG</p>'
        )
      );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <header className="max-w-4xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧬 Schéma de base de données Prisma
        </h1>
        <p className="text-gray-600">
          Visualisation complète du modèle et du diagramme relationnel.
        </p>
      </header>

      <main className="max-w-5xl mx-auto space-y-12">
        {/* Section Code */}
        <section className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📄 Fichier schema.prisma.txt
          </h2>
          <div className="overflow-auto max-h-[600px]">
            <SyntaxHighlighter
              language="prisma"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "1.5rem",
                fontSize: "0.9rem",
                background: "#1e1e1e",
                borderRadius: "0.5rem",
              }}
              showLineNumbers
              wrapLines
            >
              {schema}
            </SyntaxHighlighter>
          </div>
        </section>

        {/* Section Diagramme */}
        <section className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🗺️ Diagramme relationnel
          </h2>
          <div
            className="overflow-auto border rounded p-4 bg-gray-50"
            dangerouslySetInnerHTML={{ __html: svgContent || "" }}
          />
        </section>
        <TableRelations />
      </main>
    </div>
  );
}
