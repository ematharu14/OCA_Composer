import { Box } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { CustomPalette } from '../constants/customPalette';
import QuickStart from './Quick_Start';
import Introduction from './Introduction';
import AccordionList from './AccordionList';
import { useLocation } from 'react-router-dom';
import { Context } from '../App';
import DepreciatedWarningCard from './DepreciatedWarningCard';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

const Landing = () => {
  const path = useLocation();
  const { setCurrentPage, showDeprecationCard } = useContext(Context);

  useEffect(() => {
    if (path.pathname === '/') {
      setCurrentPage('Landing');
    }
  }, [path.pathname, setCurrentPage]);

  return (
    <>
      <Header currentPage="Landing" />
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ backgroundColor: CustomPalette.PRIMARY, width: '100%', height: '100%', paddingTop: 10, paddingBottom: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Introduction />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#ffefea', width: '100%' }}>
          <QuickStart />
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '30px' }}>
          <AccordionList />
        </Box>
        {showDeprecationCard && <DepreciatedWarningCard />}
      </Box >
      <Footer currentPage="Landing" />
    </>

  );
};


export default Landing;