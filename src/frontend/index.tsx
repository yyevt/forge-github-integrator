import React from "react";
import ForgeReconciler, {Box, Tab, TabList, TabPanel, Tabs} from "@forge/react";
import {AdminPage} from "./components/AdminPage";
import {ConnectedScreen} from "./components/ConnectedScreen";

const App = () => {
    return (
        <>
            <Tabs id="github-tabs" shouldUnmountTabPanelOnChange={true}>
                <TabList>
                    <Tab>Token setup</Tab>
                    <Tab>Repositories</Tab>
                </TabList>
                <TabPanel>
                    <Box padding="space.300">
                        <AdminPage/>
                    </Box>
                </TabPanel>
                <TabPanel>
                    <Box padding="space.300">
                        <ConnectedScreen/>
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
