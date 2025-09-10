import React, {useState} from "react";
import ForgeReconciler, {Box, Tab, TabList, TabPanel, Tabs} from "@forge/react";
import {AdminPage} from "./components/AdminPage";
import {ConnectedScreen} from "./components/ConnectedScreen";

const App = () => {
    const [selected, setSelected] = useState(0);

    const handleSelect = (index: number) => setSelected(index);

    return (
        <>
            <Tabs id="repos-tabs" onChange={handleSelect}>
                <TabList>
                    <Tab>Token setup</Tab>
                    <Tab>Repositories</Tab>
                </TabList>
                <TabPanel>
                    <Box padding="space.300">
                        {selected === 0 && (
                            <AdminPage/>
                        )}
                    </Box>
                </TabPanel>
                <TabPanel>
                    <Box padding="space.300">
                        {selected === 1 && (
                            <ConnectedScreen/>
                        )}
                    </Box>
                </TabPanel>
            </Tabs>
        </>
    );
};

ForgeReconciler.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
