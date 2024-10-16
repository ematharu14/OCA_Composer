import './App.css';
import { Box, ThemeProvider } from '@mui/material';
import { CustomTheme } from './constants/theme';
import { useRef, useState } from 'react';
import { useEffect, createContext } from 'react';
import Home from './Home';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import StartSchemaHelp from './UsersHelp/Start_Schema_Help';
import { getListOfSelectedOverlays } from './constants/getListOfSelectedOverlays';
import Landing from './Landing/Landing';
import ReactGA from 'react-ga4';
import HelpStorage from './Landing/HelpStorage';
import OCADataValidator from './OCADataValidator/OCADataValidator';
import LearnAboutSchemaRule from './OCADataValidator/LearnAboutSchemaRule';
import LearnAboutDataVerification from './OCADataValidator/LearnAboutDataVerification';
import OCAMerge from './OCAMerge/OCAMerge';
import Tutorial from './Tutorial/Tutorial';

export const Context = createContext();

//Initializing react-ga with google analytics ID
ReactGA.initialize(process.env.REACT_APP_GA_ID);

const items = {
  'Character Encoding': { feature: 'Character Encoding', selected: false },
  'Make selected entries required': {
    feature: 'Make selected entries required',
    selected: false,
  },
  'Add format rule for data': {
    feature: 'Add format rule for data',
    selected: false,
  },
  "Cardinality": { feature: "Cardinality", selected: false }
};

export const pagesArray = [
  'Start',
  'Metadata',
  'Details',
  'LanguageDetails',
  'Overlays',
  'View',
];

function App() {
  const [isZip, setIsZip] = useState(false);
  const [isZipEdited, setIsZipEdited] = useState(false);
  const [zipToReadme, setZipToReadme] = useState([]);
  const [jsonToReadme, setJsonToReadme] = useState({});
  const [fileData, setFileData] = useState([]);
  const [rawFile, setRawFile] = useState([]);
  const [attributesList, setAttributesList] = useState([]);
  const [currentPage, setCurrentPage] = useState('Landing');
  const [currentDataValidatorPage, setCurrentDataValidatorPage] = useState('StartDataValidator');
  const [currentOCAMergePage, setCurrentOCAMergePage] = useState('StartOCAMerge');
  const [history, setHistory] = useState([currentPage]);
  const [schemaDescription, setSchemaDescription] = useState({
    English: { name: '', description: '' },
  });
  const [divisionGroup, setDivisionGroup] = useState({
    division: '',
    group: '',
  });
  const [languages, setLanguages] = useState(['English']);
  const [attributeRowData, setAttributeRowData] = useState([]);
  const [entryCodeRowData, setEntryCodeRowData] = useState([]);
  const [savedEntryCodes, setSavedEntryCodes] = useState({});
  const [attributesWithLists, setAttributesWithLists] = useState([]);
  const [lanAttributeRowData, setLanAttributeRowData] = useState({});
  const [showIntroCard, setShowIntroCard] = useState(true);
  const [customIsos, setCustomIsos] = useState({});

  // Use for Overlays
  const [characterEncodingRowData, setCharacterEncodingRowData] = useState([]);
  const [formatRuleRowData, setFormatRuleRowData] = useState([]);
  const [overlay, setOverlay] = useState(items);
  const [selectedOverlay, setSelectedOverlay] = useState('');
  const [cardinalityData, setCardinalityData] = useState([]);

  // Use for OCA Validator
  const [jsonRawFile, setJsonRawFile] = useState([]);
  const [jsonParsedFile, setJsonParsedFile] = useState(undefined);
  const [jsonLoading, setJsonLoading] = useState(false);
  const [jsonDropDisabled, setJsonDropDisabled] = useState(false);
  const [jsonIsParsed, setJsonIsParsed] = useState(false);
  const [datasetRawFile, setDatasetRawFile] = useState([]);
  const [datasetLoading, setDatasetLoading] = useState(false);
  const [datasetDropDisabled, setDatasetDropDisabled] = useState(false);
  const [datasetIsParsed, setDatasetIsParsed] = useState(false);
  const [schemaDataConformantHeader, setSchemaDataConformantHeader] = useState([]);
  const [schemaDataConformantRowData, setSchemaDataConformantRowData] = useState([]);
  const [matchingRowData, setMatchingRowData] = useState([]);
  const firstTimeMatchingRef = useRef(true);
  const [ogWorkbook, setOgWorkbook] = useState(null);
  const ogSchemaDataConformantHeaderRef = useRef([]);
  const [targetResult, setTargetResult] = useState([]);
  const [notToVerifyAttributes, setNotToVerifyAttributes] = useState([]);

  // Entry Code upload
  const [entryCodeHeaders, setEntryCodeHeaders] = useState([]);
  const [tempEntryCodeRowData, setTempEntryCodeRowData] = useState([]);
  const [chosenEntryCodeIndex, setChosenEntryCodeIndex] = useState(-1);
  const [tempEntryCodeSummary, setTempEntryCodeSummary] = useState(undefined);
  const [tempEntryList, setTempEntryList] = useState([]);
  const [firstNavigationToDataset, setFirstNavigationToDataset] = useState(false);
  const [excelSheetChoice, setExcelSheetChoice] = useState(-1);

  const [OCAFile1Raw, setOCAFile1Raw] = useState("");
  const [OCAFile2Raw, setOCAFile2Raw] = useState("");
  const [parsedOCAFile1, setParsedOCAFile1] = useState("");
  const [parsedOCAFile2, setParsedOCAFile2] = useState("");
  const [selectedOverlaysOCAFile1, setSelectedOverlaysOCAFile1] = useState({});
  const [selectedOverlaysOCAFile2, setSelectedOverlaysOCAFile2] = useState({});
  const [datasetDropMessage, setDatasetDropMessage] = useState({ message: "", type: "" });

  const pageForward = () => {
    let currentIndex = pagesArray.indexOf(currentPage);
    if (currentIndex >= 0 && currentIndex < pagesArray.length - 1) {
      let newPage = pagesArray[(currentIndex += 1)];
      setCurrentPage(newPage);
      setHistory((prev) => [...prev, newPage]);
    }
  };

  const pageBack = () => {
    let currentIndex = pagesArray.indexOf(currentPage);
    if (currentIndex > 0 && currentIndex < pagesArray.length) {
      let newPage = pagesArray[(currentIndex -= 1)];
      setCurrentPage(newPage);
      setHistory((prev) => prev.slice(0, prev.length - 1));
    }
  };

  useEffect(() => {
    if (datasetRawFile.length > 0 && ogSchemaDataConformantHeaderRef.current.length === 0 && schemaDataConformantHeader.length > 0) {
      ogSchemaDataConformantHeaderRef.current = schemaDataConformantHeader;
    } else if (schemaDataConformantHeader.length === 0) {
      ogSchemaDataConformantHeaderRef.current = [];
    }
  }, [schemaDataConformantHeader]);

  useEffect(() => {
    if (history[history.length - 1] !== currentPage) {
      setHistory((prev) => [...prev, currentPage]);
    }
  }, [currentPage]);

  //Measuring page views
  useEffect(() => {
    // Track the initial page view
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  //Create Attributes List from File Data
  useEffect(() => {
    const fileAttributes = [];
    fileData.forEach((item) => {
      fileAttributes.push(item[0]);
    });
    setAttributesList(fileAttributes);
  }, [fileData]);

  //Create Attribute Row Data object when Attributes List updates
  useEffect(() => {
    const newAttributesArray = [];
    const newCharacterEncodingArray = [];
    if (attributesList.length > 0) {
      const { selectedFeatures } = getListOfSelectedOverlays(overlay);

      attributesList.forEach((item) => {
        const attributeObject = attributeRowData.find(
          (obj) => obj.Attribute === item
        );
        if (attributeObject) {
          newAttributesArray.push(attributeObject);
        } else {
          newAttributesArray.push({
            Attribute: item,
            Flagged: false,
            Unit: '',
            Type: '',
            List: false,
          });
        }

        const characterEncodingObject = characterEncodingRowData.find(
          (obj) => obj.Attribute === item
        );
        if (characterEncodingObject) {
          newCharacterEncodingArray.push(characterEncodingObject);
        } else {
          const newCharacterEncodingRow = { Attribute: item };
          selectedFeatures.forEach((feature) => {
            newCharacterEncodingRow[feature] = '';
          });
          newCharacterEncodingArray.push(newCharacterEncodingRow);
        }
      });
      setAttributeRowData(newAttributesArray);
      setCharacterEncodingRowData(newCharacterEncodingArray);
    }
  }, [attributesList]);

  useEffect(() => {
    const newFormatRuleArray = [];
    attributeRowData.forEach((item) => {
      const formatRuleObject = formatRuleRowData.find(
        (obj) => obj.Attribute === item.Attribute
      );

      if (formatRuleObject && formatRuleObject.Type === item.Type) {
        newFormatRuleArray.push(formatRuleObject);
      } else {
        newFormatRuleArray.push({
          Attribute: item.Attribute,
          Type: item.Type,
          FormatText: '',
        });
      }
    });
    setFormatRuleRowData(newFormatRuleArray);
  }, [attributeRowData]);

  useEffect(() => {
    if (jsonRawFile.length > 0) {
      const newMatchingRowData = [];
      attributesList.forEach((item, index) => {
        // if matchingRowData has data, use it
        const matchingRow = matchingRowData.find(
          (obj) => obj.Attribute === item
        );
        const newObj = {
          Attribute: item,
          Dataset: ''
        };
        if (matchingRow) {
          newObj['Dataset'] = matchingRow['Dataset'];
        }
        languages.forEach((lang) => {
          newObj[lang] = lanAttributeRowData?.[lang]?.[index]?.Label;
        });
        newMatchingRowData.push(newObj);
      });
      setMatchingRowData(newMatchingRowData);
    }
  }, [datasetRawFile, jsonRawFile, attributesList]);

  function createEntryCodeRowData(
    languages,
    attributesWithLists,
    savedEntryCodes
  ) {
    const newEntryCodesArray = [];

    const newEntryCodeRow = { Code: '' };
    languages.forEach((lang) => {
      newEntryCodeRow[lang] = '';
    });

    if (attributesWithLists.length > 0) {
      attributesWithLists.forEach((item) => {
        const listEntryCodesArray = [];

        if (Array.isArray(item)) {
          item.forEach((subItem) => {
            const entryCodeRows = savedEntryCodes[subItem]
              ? savedEntryCodes[subItem]
              : [{ ...newEntryCodeRow }];

            entryCodeRows.forEach((entryCodeRow) => {
              listEntryCodesArray.push(entryCodeRow);
            });
          });
        } else {
          const entryCodeRows = savedEntryCodes[item]
            ? savedEntryCodes[item]
            : [{ ...newEntryCodeRow }];

          entryCodeRows.forEach((entryCodeRow) => {
            listEntryCodesArray.push(entryCodeRow);
          });
        }

        newEntryCodesArray.push(listEntryCodesArray);
      });

      return newEntryCodesArray;
    }
  }

  //Re-set Entry Code Row Data when items update
  useEffect(() => {
    const newEntryCodesArray = createEntryCodeRowData(
      languages,
      attributesWithLists,
      savedEntryCodes
    );
    setEntryCodeRowData(newEntryCodesArray);
  }, [languages, attributesWithLists, savedEntryCodes]);

  //Re-set all fields when fileData updates
  useEffect(() => {
    setSchemaDescription({
      English: { name: '', description: '' },
    });

    setDivisionGroup({
      division: '',
      group: '',
    });

    setLanguages(['English']);
    setAttributeRowData([]);
    setEntryCodeRowData([]);
    setAttributesWithLists([]);
    setSavedEntryCodes({});
    setLanAttributeRowData({});
    setIsZip(false);
    setZipToReadme([]);
  }, [fileData, jsonRawFile]);

  return (
    <div className='App'>
      <ThemeProvider theme={CustomTheme}>
        <Context.Provider
          value={{
            fileData,
            setFileData,
            rawFile,
            setRawFile,
            attributesList,
            setAttributesList,
            schemaDescription,
            setSchemaDescription,
            divisionGroup,
            setDivisionGroup,
            languages,
            setLanguages,
            attributeRowData,
            setAttributeRowData,
            entryCodeRowData,
            setEntryCodeRowData,
            attributesWithLists,
            setAttributesWithLists,
            savedEntryCodes,
            setSavedEntryCodes,
            lanAttributeRowData,
            setLanAttributeRowData,
            setCurrentPage,
            history,
            setHistory,
            customIsos,
            setCustomIsos,
            isZip,
            setIsZip,
            characterEncodingRowData,
            setCharacterEncodingRowData,
            formatRuleRowData,
            setFormatRuleRowData,
            overlay,
            setOverlay,
            selectedOverlay,
            setSelectedOverlay,
            zipToReadme,
            setZipToReadme,
            jsonToReadme,
            setJsonToReadme,
            isZipEdited,
            setIsZipEdited,
            cardinalityData,
            setCardinalityData,
            setCurrentDataValidatorPage,
            currentDataValidatorPage,
            jsonLoading,
            setJsonLoading,
            jsonDropDisabled,
            setJsonDropDisabled,
            datasetLoading,
            setDatasetLoading,
            datasetDropDisabled,
            setDatasetDropDisabled,
            jsonRawFile,
            setJsonRawFile,
            datasetRawFile,
            setDatasetRawFile,
            jsonIsParsed,
            setJsonIsParsed,
            datasetIsParsed,
            setDatasetIsParsed,
            schemaDataConformantHeader,
            setSchemaDataConformantHeader,
            matchingRowData,
            setMatchingRowData,
            firstTimeMatchingRef,
            schemaDataConformantRowData,
            setSchemaDataConformantRowData,
            ogWorkbook,
            setOgWorkbook,
            jsonParsedFile,
            setJsonParsedFile,
            ogSchemaDataConformantHeaderRef,
            entryCodeHeaders,
            setEntryCodeHeaders,
            tempEntryCodeRowData,
            setTempEntryCodeRowData,
            chosenEntryCodeIndex,
            setChosenEntryCodeIndex,
            tempEntryCodeSummary,
            setTempEntryCodeSummary,
            tempEntryList,
            setTempEntryList,
            excelSheetChoice,
            setExcelSheetChoice,
            setCurrentOCAMergePage,
            OCAFile1Raw,
            setOCAFile1Raw,
            OCAFile2Raw,
            setOCAFile2Raw,
            parsedOCAFile1,
            setParsedOCAFile1,
            parsedOCAFile2,
            setParsedOCAFile2,
            selectedOverlaysOCAFile1,
            setSelectedOverlaysOCAFile1,
            selectedOverlaysOCAFile2,
            setSelectedOverlaysOCAFile2,
            firstNavigationToDataset,
            setFirstNavigationToDataset,
            targetResult,
            setTargetResult,
            datasetDropMessage,
            setDatasetDropMessage,
            notToVerifyAttributes,
            setNotToVerifyAttributes
          }}
        >
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<Landing />} />
                <Route
                  path='/start'
                  element={
                    <Home
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      pageForward={pageForward}
                      pageBack={pageBack}
                      showIntroCard={showIntroCard}
                      setShowIntroCard={setShowIntroCard}
                    />
                  }
                />
                <Route
                  path='/oca-data-validator'
                  element={
                    <OCADataValidator />
                  }
                />
                {/* <Route
                  path='/help_designing_datasets'
                  element={<GuidanceForDesigningDataSets />}
                /> */}
                <Route path='/help_storage' element={<HelpStorage />} />
                <Route
                  path='/start_schema_help'
                  element={<StartSchemaHelp />}
                />
                <Route
                  path='/learn_schema_rule'
                  element={<LearnAboutSchemaRule />}
                />
                <Route
                  path='/learn_data_verification'
                  element={<LearnAboutDataVerification />}
                />
                <Route path='*' element={<Navigate to='/' />} />
                <Route
                  path='/oca-merge'
                  element={<OCAMerge currentOCAMergePage={currentOCAMergePage} />}
                />
                <Route path='/tutorial' element={<Tutorial />} />
              </Routes>
            </BrowserRouter>
          </Box>
        </Context.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
