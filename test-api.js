import fetch from 'node-fetch';

async function testAPI() {
    try {
        // Test GET
        console.log('Testing GET /aslab/api/pewawancara...');
        const getResponse = await fetch('http://localhost:3000/aslab/api/pewawancara');
        const getData = await getResponse.json();
        console.log('GET Response:', getData);

        // Test POST
        console.log('\nTesting POST /aslab/api/pewawancara...');
        const postResponse = await fetch('http://localhost:3000/aslab/api/pewawancara', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nama: 'Test Pewawancara',
                kontak: '081234567890'
            })
        });
        
        const postData = await postResponse.json();
        console.log('POST Response:', postData);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAPI(); 