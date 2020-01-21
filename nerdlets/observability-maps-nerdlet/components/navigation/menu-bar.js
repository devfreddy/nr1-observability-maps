import React from "react";
import { Icon, Button } from "semantic-ui-react";
import { navigation } from "nr1";
import CreateMap from "../map/create";
import DeleteMap from "../map/delete";
import ExportMap from "../map/export";
import Select from "react-select";
import UserConfig from "../user-config";
import ManageNodes from "../node/manage";
import ManageLinks from "../link/manage";
import ImportMap from "../map/import";
import RefreshSelector from "../map/refresh";
import ManageIcons from "../icons/manage";

function openChartBuilder(query, account) {
    const nerdlet = {
        id: "wanda-data-exploration.nrql-editor",
        urlState: {
            initialActiveInterface: "nrqlEditor",
            initialChartType: "table",
            initialAccountId: account,
            initialNrqlValue: query,
            isViewingQuery: true
        }
    };
    navigation.openOverlay(nerdlet);
}

export default class MenuBar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedMap: null
        };
        this.handleMapMenuChange = this.handleMapMenuChange.bind(this);
    }

    handleMapMenuChange = selectedMap => {
        if (typeof selectedMap === "string" || selectedMap instanceof String) {
            let map = this.props.userMaps.filter(map => map.id == selectedMap);
            if (map.length == 1) {
                let selected = { value: map[0].id, label: map[0].id, type: "user" };
                this.setState({ selectedMap: selected });
                this.props.setParentState({ selectedMap: selected }, ["loadMap"]);
            }
        } else {
            this.setState(
                { selectedMap },
                () => this.props.setParentState({ selectedMap }, ["loadMap"]),
                () => console.log(`Map selected:`, this.state.selectedMap)
            );
        }
    };

    render() {
        let { selectedMap } = this.state;
        let {
            accounts,
            accountMaps,
            userMaps,
            dataFetcher,
            loading,
            setParentState,
            mapConfig,
            mapData,
            bucketMs,
            userIcons,
            timelineOpen
        } = this.props;
        let availableMaps = [];

        if (accountMaps) {
            accountMaps = accountMaps.map(map => ({
                value: map.id,
                label: map.id.replace("+", " "),
                type: "account"
            }));
            availableMaps = [...availableMaps, ...accountMaps];
        }
        if (userMaps) {
            userMaps = userMaps.map(map => ({
                value: map.id,
                label: map.id.replace("+", " "),
                type: "user"
            }));
            availableMaps = [...availableMaps, ...userMaps];
        }

        return (
            <div>
                <div className="utility-bar">
                    <div className="react-select-input-group">
                        <label>Select Map</label>
                        <Select
                            options={availableMaps}
                            onChange={this.handleMapMenuChange}
                            value={selectedMap}
                            classNamePrefix="react-select"
                        />
                    </div>

                    {selectedMap ? (
                        <DeleteMap
                            selectedMap={selectedMap}
                            dataFetcher={dataFetcher}
                            handleMapMenuChange={this.handleMapMenuChange}
                            setParentState={setParentState}
                        />
                    ) : (
                        ""
                    )}

                    <CreateMap
                        accountMaps={accountMaps}
                        userMaps={userMaps}
                        dataFetcher={dataFetcher}
                        handleMapMenuChange={this.handleMapMenuChange}
                        setParentState={setParentState}
                    />

                    <ImportMap userMaps={userMaps} dataFetcher={dataFetcher} setParentState={setParentState} />

                    {selectedMap ? (
                        <ExportMap
                            selectedMap={selectedMap}
                            userMaps={userMaps}
                            mapConfig={mapConfig}
                            setParentState={setParentState}
                        />
                    ) : (
                        ""
                    )}

                    <div className="flex-push"></div>

                    {selectedMap ? (
                        <ManageNodes
                            accounts={accounts}
                            mapConfig={mapConfig}
                            mapData={mapData}
                            dataFetcher={dataFetcher}
                            selectedMap={selectedMap}
                            setParentState={setParentState}
                        />
                    ) : (
                        ""
                    )}
                    {selectedMap ? (
                        <ManageLinks
                            accounts={accounts}
                            mapConfig={mapConfig}
                            mapData={mapData}
                            dataFetcher={dataFetcher}
                            selectedMap={selectedMap}
                            setParentState={setParentState}
                        />
                    ) : (
                        ""
                    )}

                    {/* <UserConfig /> */}

                    <ManageIcons userIcons={userIcons} dataFetcher={dataFetcher} setParentState={setParentState} />

                    {selectedMap ? (
                        <Button
                            icon={timelineOpen ? "clock" : "clock outline"}
                            content="Timeline"
                            className="filter-button"
                            onClick={() => setParentState({ timelineOpen: !timelineOpen })}
                        />
                    ) : (
                        ""
                    )}

                    <RefreshSelector bucketMs={bucketMs} setParentState={setParentState} />

                    <Icon
                        loading={loading}
                        circular
                        name={loading ? "spinner" : "circle"}
                        color={loading ? "black" : "green"}
                        style={{ backgroundColor: "white" }}
                    />
                </div>
            </div>
        );
    }
}