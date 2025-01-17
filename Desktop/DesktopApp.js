exports.newDesktopApp = function newDesktopApp() {

    let thisObject = {
        userProfiles: undefined,
        p2pNetworkClient: undefined,
        p2pNetwork: undefined,
        p2pNetworkPeers: undefined,
        webSocketsClient: undefined,
        webSocketsInterface: undefined,
        socialGraph: undefined,
        run: run
    }

    DK.desktopApp = thisObject

    return thisObject

    async function run() {

        setupNetwork()
        setupServices()

        async function setupNetwork() {
            /*
            We set up ourselves as a Network Client.
            */
            thisObject.p2pNetworkClient = SA.projects.network.modules.p2pNetworkClient.newNetworkModulesP2PNetworkClient()
            await thisObject.p2pNetworkClient.initialize()
            /*
            We will read all user profiles plugins and get from there our network identity.
            */
            thisObject.userProfiles = SA.projects.network.modules.userProfiles.newNetworkModulesUserProfiles()
            await thisObject.userProfiles.initialize(global.env.DESKTOP_APP_SIGNING_ACCOUNT, thisObject.p2pNetworkClient)
            /*
            We set up the P2P Network.
            */
            thisObject.p2pNetwork = SA.projects.network.modules.p2pNetwork.newNetworkModulesP2PNetwork()
            await thisObject.p2pNetwork.initialize('Network Client')
            /*
            Set up the connections to network nodes.
            */
            thisObject.p2pNetworkPeers = SA.projects.network.modules.p2pNetworkPeers.newNetworkModulesP2PNetworkPeers()
            await thisObject.p2pNetworkPeers.initialize(
                'Network Client',
                thisObject.p2pNetworkClient,
                thisObject.p2pNetwork,
                global.env.DESKTOP_APP_MAX_OUTGOING_PEERS
            )
        }

        async function setupServices() {
            /*
            This is the Personal Social Graph for the user running this App.
            */
            thisObject.socialGraph = DK.projects.socialTrading.modules.socialGraph.newSocialTradingModulesSocialGraph()
            await thisObject.socialGraph.initialize()
            /* 
            These are the Network Interfaces by which the Web App interacts with this Desktop Client.
            */
            thisObject.webSocketsInterface = DK.projects.socialTrading.modules.webSocketsInterface.newDesktopModulesWebSocketsInterface()
            thisObject.webSocketsInterface.initialize()
            console.log('Desktop Client Web Sockets Interface ....................................... Listening at port ' + global.env.DESKTOP_WEB_SOCKETS_INTERFACE_PORT)

            thisObject.httpInterface = DK.projects.socialTrading.modules.httpInterface.newDesktopModulesHttpInterface()
            thisObject.httpInterface.initialize()
            console.log('Desktop Client Http Interface .............................................. Listening at port ' + global.env.DESKTOP_HTTP_INTERFACE_PORT)
        }
    }
}
