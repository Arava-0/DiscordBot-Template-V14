let CLIENT;

function setClient(initializedClient) {
    CLIENT = initializedClient;
}

function getClient() {
    return CLIENT;
}

module.exports = {
    setClient,
    getClient
};
