import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

interface HTMLPageLoaderProps {
  pagePath: string;
}

const HTMLPageLoader: React.FC<HTMLPageLoaderProps> = ({ pagePath }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("HTMLPageLoader: Loading page:", pagePath);

    const loadPage = async () => {
      try {
        // Create a container for the content
        const container = document.createElement("div");
        container.id = "page-content";
        document.body.appendChild(container);

        // Load the HTML file
        const response = await fetch(pagePath);
        if (!response.ok) {
          throw new Error(`Failed to load page: ${response.statusText}`);
        }

        const html = await response.text();
        console.log("HTMLPageLoader: Page content loaded");

        // Create a temporary container to parse the HTML
        const temp = document.createElement("div");
        temp.innerHTML = html;

        // Get all script tags
        const scripts = Array.from(temp.getElementsByTagName("script"));

        // Get all style tags and links
        const styles = Array.from(temp.getElementsByTagName("style"));
        const links = Array.from(temp.getElementsByTagName("link"));

        // Get the body content
        const bodyContent = temp.querySelector("body")?.innerHTML || "";
        container.innerHTML = bodyContent;

        // Add styles
        styles.forEach((style) => {
          document.head.appendChild(style.cloneNode(true));
        });

        // Add links (CSS)
        links.forEach((link) => {
          if (link.rel === "stylesheet") {
            document.head.appendChild(link.cloneNode(true));
          }
        });

        // Re-execute scripts
        for (const script of scripts) {
          const newScript = document.createElement("script");

          // Copy all attributes
          Array.from(script.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });

          // Handle both inline and external scripts
          if (script.src) {
            newScript.src = script.src;
            await new Promise((resolve, reject) => {
              newScript.onload = resolve;
              newScript.onerror = reject;
              document.body.appendChild(newScript);
            });
          } else {
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
          }
        }

        console.log("HTMLPageLoader: Page loaded successfully");
        setLoading(false);
      } catch (err: any) {
        console.error("HTMLPageLoader: Error loading page:", err);
        setError(err.message);
        setLoading(false);
        navigate("/error");
      }
    };

    loadPage();

    return () => {
      // Cleanup
      const container = document.getElementById("page-content");
      if (container) {
        container.remove();
      }
    };
  }, [pagePath, navigate]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        color="error.main"
      >
        {error}
      </Box>
    );
  }

  return null;
};

export default HTMLPageLoader;
