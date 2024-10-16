import React, { useEffect } from "react";
import { Button, Box, Typography, FormControl, InputLabel, Select } from "@mui/material";
import StartIntro from "./StartIntro";
import Drop from "./Drop";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { CustomPalette } from "../constants/customPalette";
import useHandleAllDrop from "./useHandleAllDrop";
import { useTranslation } from "react-i18next";
import ExcelSheetSelection from "../components/ExcelSheetSelection";

export default function StartSchema({ pageForward }) {
  const { t } = useTranslation();
  const {
    setAttributesList,
    setRawFile,
    attributesList,
    setLoading,
    loading,
    dropDisabled,
    dropMessage,
    setDropMessage,
    setDropDisabled,
    setFileData,
    setCurrentPage,
    switchToLastPage,
    excelSheetNames,
    setExcelSheetChoice,
    setExcelSheetNames,
    excelSheetChoice,
    handlePageForward
  } = useHandleAllDrop(pageForward);

  useEffect(() => {
    if (switchToLastPage) {
      setCurrentPage('View');
    }
  }, [switchToLastPage]);

  return (
    <Box sx={{ mt: 5, mb: 3 }}>
      <Box width="80%" margin="auto">
        <Typography variant="h5">
          <Box sx={{ marginTop: 2 }}>
            {t("Welcome to Agri-food Data Canada's schema writer...")}
          </Box>
        </Typography>
      </Box>
      <Box
        display="flex"
        sx={{
          flexDirection: "column",
          alignItems: "center",
          width: 600,
          margin: "auto",
          marginBottom: 10,
        }}
      >
        <Box
          sx={{
            height: "3rem",
            alignSelf: "flex-end",
            transform: "translateY(2.5rem)",
          }}
        >
          {(attributesList.length > 0 || excelSheetChoice !== -1) && (
            <Button
              variant="text"
              color="navButton"
              sx={{ fontSize: "1.2rem", color: CustomPalette.PRIMARY }}
              onClick={handlePageForward}
            >
              {t('Next')} <ArrowForwardIosIcon />
            </Button>
          )}
        </Box>
        {excelSheetNames.length > 0 ? (
          <ExcelSheetSelection chosenValue={excelSheetChoice} choices={excelSheetNames} setChoice={setExcelSheetChoice} />
        ) : (
          <Drop
            setFile={setRawFile}
            setLoading={setLoading}
            loading={loading}
            dropDisabled={dropDisabled}
            dropMessage={dropMessage}
            setDropMessage={setDropMessage}
          />
        )}
        {attributesList.length > 0 || excelSheetNames.length > 0 ? (
          <Box display="flex">
            <Button
              variant="contained"
              color="button"
              onClick={() => {
                setDropDisabled(false);
                setFileData([]);
                setAttributesList([]);
                setExcelSheetChoice(-1);
                setExcelSheetNames([]);
              }}
              sx={{ width: 170, mr: 2 }}
            >
              {t("New File")}
            </Button>
            <Button
              variant="contained"
              color="button"
              sx={{ width: 170, ml: 2 }}
              onClick={() => setCurrentPage("Create")}
            >
              {t("Edit")}
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="button"
            sx={{ width: 190 }}
            onClick={() => setCurrentPage("Create")}
          >
            {t("Create Manually")}
          </Button>
        )}
      </Box>
      <StartIntro />
    </Box>
  );
}
