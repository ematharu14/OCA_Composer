import React, { useContext, useEffect, useState, useRef } from "react";
import { Box } from "@mui/system";
import { Button, Typography, Alert } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Context } from "../App";
import SingleTable from "./SingleTable";
import { removeSpacesFromArrayOfObjects } from "../constants/removeSpaces";

export default function EntryCodes() {
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedAttributesList, setSelectedAttributesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    attributeRowData,
    entryCodeRowData,
    setSavedEntryCodes,
    attributesWithLists,
    setCurrentPage,
    languages,
  } = useContext(Context);

  const codeRefs = useRef();
  const entryCodeData = useRef();

  const errorMessages = {
    fieldEmpty: "Please fill out all fields",
    quoteMisuse: "Fields cannot contain quotes or commas",
  };

  //Create codeRefs so there can be multiple grids on the page
  useEffect(() => {
    if (!codeRefs.current) {
      codeRefs.current = attributesWithLists.map(() => React.createRef());
    }
  }, [attributesWithLists]);

  //Create data object and array for only attributes that have lists
  useEffect(() => {
    const filteredAttributes = attributeRowData.filter(
      (item) => item.List === true
    );
    const attributeArray = filteredAttributes.map((item) => item.Attribute);
    setSelectedAttributes(filteredAttributes);
    setSelectedAttributesList(attributeArray);
  }, [attributeRowData]);

  const handleSave = () => {
    codeRefs.current.forEach((grid) => {
      grid.current.api.stopEditing();
    });

    const newEntryCodeObject = {};
    attributesWithLists.forEach((item, index) => {
      const newEntryCodeArray = [];
      entryCodeRowData[index].forEach((obj) => {
        let newObj = {};
        newObj["Code"] = obj["Code"];
        languages.forEach((language) => {
          newObj[language] = obj[language] || "";
        });
        newEntryCodeArray.push(newObj);
      });
      newEntryCodeObject[item] = newEntryCodeArray;
    });

    setSavedEntryCodes(newEntryCodeObject);
    entryCodeData.current = newEntryCodeObject;
  };

  const pageBackSave = () => {
    handleSave();
    setCurrentPage("Details");
  };

  const pageForwardDisabledRef = useRef(false);

  //Quotes, commas and blanks in these fields cause issues with the excel export (they interfere with the drop-down menu formatting)

  const pageForwardSave = () => {
    pageForwardDisabledRef.current = false;
    handleSave();
    if (entryCodeData.current) {
      const values = Object.values(entryCodeData.current);
      values.forEach((item) => {
        item.forEach((obj) => {
          const values = Object.values(obj);
          values.forEach((value) => {
            if (!value) {
              pageForwardDisabledRef.current = true;
              setErrorMessage(errorMessages.fieldEmpty);
              setTimeout(() => {
                setErrorMessage("");
              }, [2000]);
            }
            if (
              value.includes("'") ||
              value.includes('"') ||
              value.includes("`") ||
              value.includes(",")
            ) {
              pageForwardDisabledRef.current = true;
              setErrorMessage(errorMessages.quoteMisuse);
              setTimeout(() => {
                setErrorMessage("");
              }, [2000]);
            }
          });
        });
      });

      const keys = Object.keys(entryCodeData.current);
      const newEntryCodesObject = {};
      keys.forEach((item) => {
        newEntryCodesObject[item] = removeSpacesFromArrayOfObjects(
          entryCodeData.current[item]
        );
      });

      setSavedEntryCodes(newEntryCodesObject);
    }

    if (!pageForwardDisabledRef.current) {
      setCurrentPage("LanguageDetails");
    }
  };

  const allCodesDisplay = selectedAttributesList.map((item, index) => {
    return (
      <SingleTable
        attribute={selectedAttributes[index]}
        key={selectedAttributes[index].Attribute}
        index={index}
        codeRefs={codeRefs}
      />
    );
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          pr: 10,
          pl: 10,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            color="navButton"
            sx={{ textAlign: "left", alignSelf: "flex-start" }}
            onClick={pageBackSave}
          >
            <ArrowBackIosIcon /> Back
          </Button>
          <Box sx={{ alignSelf: "flex-end", mb: 5 }}>
            <Button color="navButton" onClick={pageForwardSave}>
              Next <ArrowForwardIosIcon />
            </Button>
            {errorMessage.length > 0 && (
              <Alert
                severity="error"
                style={{
                  position: "absolute",
                  zIndex: 9999,
                  right: "20%",
                  transform: "translateY(-90%)",
                }}
              >
                {errorMessage}
              </Alert>
            )}
          </Box>
        </Box>
        <Box sx={{ width: "90%", margin: "auto" }}>
          <Typography
            sx={{
              fontSize: 15,
              textAlign: "left",
              margin: "1rem 0 1rem 0",
              width: 500,
            }}
          >
            You indicated in the previous step that one or more attributes is a
            list. Please add entry codes for the same:
          </Typography>
          {selectedAttributes.length > 0 && allCodesDisplay}
        </Box>
      </Box>
    </Box>
  );
}
