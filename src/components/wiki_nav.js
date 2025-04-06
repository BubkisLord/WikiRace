import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { addVisitedLinkByJoinCode } from "../database";

export default function WikipediaNavigator({
  playerName,
  joinCode,
  startPage,
  endPage,
}) {
  const [pageTitle, setPageTitle] = useState(startPage);
  const [pageHtml, setPageHtml] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Wikipedia page
  const fetchPage = async (title) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
          title
        )}&format=json&origin=*`
      );
      const data = await response.json();
      if (data.parse?.text) {
        setPageHtml(data.parse.text["*"]);
        setPageTitle(data.parse.title);
      } else {
        setPageHtml("<p>Page not found.</p>");
      }
    } catch (error) {
      console.error("Error fetching page:", error);
      setPageHtml("<p>Error loading page.</p>");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(pageTitle);
  }, [pageTitle]);

  // Handle link clicks inside the rendered HTML
  const handleLinkClick = (e) => {
    const target = e.target;
    if (target.tagName === "A" && target.href.includes("/wiki/")) {
      e.preventDefault();
      const newTitle = decodeURIComponent(target.href.split("/wiki/")[1]);
      addVisitedLinkByJoinCode(joinCode, playerName, newTitle, endPage);
      fetchPage(newTitle);
    }
  };

  return (
    <div
      className="rounded-lg border border-gray-700 shadow-md p-4 bg-gray-800"
      style={{ margin: "0 16% 16%" }}
    >
      <h1 className="text-3xl font-bold mb-4 text-center border-b pb-2 text-white">
        {(pageTitle || "").replace(/_/g, " ")}
      </h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div
          onClick={handleLinkClick}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pageHtml) }}
          className="prose max-w-none mx-auto"
          style={{ color: "white" }}
        />
      )}
      <style>
        {`
          .loader {
            border: 4px solid #f3f3f3; /* Light gray */
            border-top: 4px solid #3b82f6; /* Blue */
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
            
          .prose a {
            color: #3b82f6; /* Blue link color */
            text-decoration: underline;
          }
          .prose img {
            pointer-events: none; /* Disable clicking on images */
            float: right;
            margin: 0 0 10px 10px;
            max-width: 200px;
            height: auto;
          }
          .prose .figcaption {
            text-align: center;
            font-size: 0.9em;
            margin-top: 5px;
            clear: both;
            color: #d1d5db; /* Light gray for captions */
          }
          .prose table {
            float: right;
            border-collapse: collapse;
            margin: 0 0 10px 10px;
            border: 1px solid #4b5563; /* Gray border */
            width: 25%;
          }

          .prose table caption {
            font-size: 1.1em;
            font-weight: bold;
            caption-side: top;
            text-align: center;
            padding-bottom: 2.5px;
            margin-bottom: -1px;
            color: #d1d5db; /* Light gray for captions */
            border: 1px solid #4b5563; /* Gray border */
          }

          .prose table th,
          .prose table td {
            border: 1px solid #4b5563; /* Gray border */
            padding: 5px;
            text-align: left;
            color: white; /* White text */
            background-color: #1f2937; /* Dark background */
          }
          .prose .thumb.tmulti.tright {
            float: right;
            border-collapse: collapse;
            margin: 0 0 10px 10px;
            border: 1px solid #4b5563; /* Gray border */
            max-width: 20%;
            background-color: #1f2937; /* Dark background */
          }

          .prose .thumb.tmulti.tright .thumbinner {
            padding: 5px;
            text-align: left;
            color: white; /* White text */
          }

          .prose .thumb.tmulti.tright .thumbcaption {
            font-size: 1.1em;
            font-weight: bold;
            caption-side: top;
            text-align: center;
            padding-bottom: 2.5px;
            margin-bottom: -1px;
            color: #d1d5db; /* Light gray for captions */
            border-top: 1px solid #4b5563; /* Gray border */
          }
          .prose .mw-heading.mw-heading2 {
            font-weight: bold;
            font-size: 1.7em;
            font-family: 'Arial', sans-serif;
            border-bottom: 2px solid #4b5563;
            padding-top: 1.4em;
          }
          .prose .mw-heading.mw-heading1 {
            font-weight: bold;
            font-size: 2.4em;
            font-family: 'Arial', sans-serif;
            border-bottom: 3px solid #4b5563;
            padding-top: 1.9em;
          }
          .prose .mw-heading.mw-heading3 {
            font-weight: bold;
            font-size: 1.2em;
            font-family: 'Arial', sans-serif;
            padding-top: 1.2em;
          }
          .prose .mw-editsection {
            display: none;
          }
          .prose p {
            margin-top: 1em; /* Add top margin to paragraphs */
          }
          .prose figure {
            float: right;
            border-collapse: collapse;
            margin: 0 0 10px 10px;
            border: 1px solid #4b5563; /* Gray border */
            max-width: 20%;\
            
            background-color: #1f2937; /* Dark background */
            padding-left: 10px;
            padding-top: 10px;
            padding-bottom: 6px;
            padding-right: 4px;
            clear: right; /* Prevent figures from being next to each other */
            text-align: center;
          }

          .prose figure img {
            display: block;
            margin: 0 auto;
            pointer-events: none; /* Disable clicking on images */
          }

          .prose figure .figcaption {
            display: block;
            margin-top: 5px;
            font-size: 0.9em;
            color: #d1d5db; /* Light gray for captions */
          }
        `}
      </style>
    </div>
  );
}
