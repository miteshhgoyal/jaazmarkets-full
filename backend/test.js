// Test your BlockBee configuration
const testBlockBee = async () => {
    const apiKey = 'AoxpSRGjhuBkaUIS6Oj4tN23qWWYsElY1wC62iqkKZ1I';

    // Test 1: Check supported cryptocurrencies
    const infoResponse = await fetch(`https://api.blockbee.io/info/prices/?apikey=${apiKey}`);
    const info = await infoResponse.json();
    console.log('BlockBee Info:', info);

    // Test 2: Check deposit configuration
    const depositTest = await fetch(`https://api.blockbee.io/deposit/request/?apikey=${apiKey}&notify_url=https://example.com/webhook&currency=usd`);
    const depositResult = await depositTest.json();
    console.log('Deposit Test:', depositResult);
};

testBlockBee();
