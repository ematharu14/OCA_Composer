import React, { useState, useEffect } from "react";
import { Typography, Stack, Tooltip, Button, Box } from "@mui/material";
import { CustomPalette } from "../constants/customPalette";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function Header({ currentPage }) {
  const [header, setHeader] = useState(currentPage);
  const [toolTipText, setToolTipText] = useState("");
  const [headerLink, setHeaderLink] = useState(
    "https://agrifooddatacanada.ca/semantic-engine/"
  );
  //Sets headers and tooltip Text based on current page
  useEffect(() => {
    switch (currentPage) {
      case "Start":
        setHeader("Start Creating an OCA Schema");
        setToolTipText("");
        break;
      case "Metadata":
        setHeader("Schema Metadata");
        setToolTipText(
          "This page is where you can write the metadata describing the schema you are writing. Metadata helps people find, understand, and use your schema. If you name and describe your schema descriptions in general terms, it will be easier for you and others to reuse the schema for different datasets. This will help with ensuring your data is more interoperable."
        );
        break;
      case "Details":
        setHeader("Attribute Details");
        setToolTipText(
          "Each column of your dataset is an attribute in your schema. Here you can add more details about each attribute to help people understand and use your dataset."
        );
        break;
      case "Codes":
        setHeader("Add Entry Codes");
        setToolTipText(
          "Entry codes are options you want available to users as a list of choices for a specific attribute. For example, to limit gender entry to one of three choices you can use entry codes M, F, and X. Then for the English entries you can enter Male, Female and Other. If you have another language such as French, you could use Masculin, Féminin, and Autre as labels for the entry code."
        );
        break;
      case "LanguageDetails":
        setHeader("Language Dependent Attribute Details");
        setToolTipText(
          "You can add details in each language to help users of your schema. By having languages separate from the underlying structure it means you can share your schema in multiple languages."
        );
        break;
      case "View":
        setHeader("View Schema");
        setToolTipText(
          "Before finishing your schema you can preview the final contents on this page."
        );
        break;
      default:
        setHeader("Start Schema");
    }
  }, [currentPage]);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        mb: 2,
        pl: 4,
        pr: 4,
        borderBottom: 0.5,
        borderColor: CustomPalette.GREY_300,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            fontSize: 25,
            fontWeight: "bold",
            color: CustomPalette.BLUE_700,
            alignSelf: "center",
          }}
        >
          {header}
        </Typography>
        {toolTipText.length > 0 && (
          <Box sx={{ marginLeft: 2, color: CustomPalette.GREY_600 }}>
            <Tooltip
              title={toolTipText}
              placement={
                header === "Attribute Details" || header === "View Schema"
                  ? "right"
                  : "right-start"
              }
              arrow
            >
              <HelpOutlineIcon sx={{ fontSize: 15 }} />
            </Tooltip>
          </Box>
        )}
      </Box>
      <Stack
        direction="row"
        sx={{
          width: 250,
          alignItems: "center",
        }}
      >
        <Button
          color="button"
          variant="contained"
          href={headerLink}
          target="_blank"
          sx={{
            m: 2,
            mr: 5,
            p: 1,
            width: "15rem",
          }}
        >
          Help with this page
        </Button>
        <Box>En</Box>
      </Stack>
    </Stack>
  );
}
