import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { authFetchPdf } from "./utils/authFetch";

export default function usePdfThumbnail(idnorme, navigate) {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfThumbnail, setPdfThumbnail] = useState(null);

  useEffect(() => {
    const loadPdfThumbnail = async () => {
      setLoadingPdf(true);
      try {
        const blob = await authFetchPdf(
          `http://localhost:8000/normes/${idnorme}/pdf`,
          {},
          navigate,
          "blob"
        );

        if (!blob) {
          setLoadingPdf(false);
          return;
        }

        const arrayBuffer = await blob.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        setPdfThumbnail(canvas.toDataURL());
        setLoadingPdf(false);
      } catch (err) {
        console.error("Erreur PDF:", err);
        setPdfThumbnail(null);
        setLoadingPdf(false);
      }
    };

    if (idnorme) loadPdfThumbnail();
  }, [idnorme, navigate]);

  return { loadingPdf, pdfThumbnail };
}
