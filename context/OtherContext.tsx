import React, {createContext, useState} from 'react';

export const OtherContext = createContext(null);

const OtherProvider = ({children}) => {

    const [burgerIcon, setBurgerIcon] = useState(false); //false - not open
    const [burgerIconVisibility, setBurgerIconVisibility] = useState(false); //false - not open
    const [activeTab, setActiveTab] = useState('');
    const [expanded, setExpanded] = useState(true);
    const [sidebarVisibility, setSidebarVisibility] = useState(true);


    return (
        <OtherContext.Provider value={{
            burgerIcon, 
            setBurgerIcon,
            burgerIconVisibility, setBurgerIconVisibility,
            activeTab, setActiveTab,
            expanded, setExpanded,
            sidebarVisibility, setSidebarVisibility
        }}>{children}</OtherContext.Provider>
    )
}


export default OtherProvider;