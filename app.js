require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000; // Pobierz port z zmiennej środowiskowej PORT lub użyj domyślnego portu 3000

app.use(bodyParser.json()); // Obsługa JSON

// Inicjalizacja Google AI
let genAI;
let embeddingModel;

try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    console.log('Google AI initialized successfully.');
} catch (error) {
    console.error('Error initializing Google AI:', error);
}


// Endpoint do testowania (dostępny pod '/')
app.get('/', (req, res) => {
  res.send('OK');
});

// Endpoint do obsługi wiadomości od użytkownika
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).send({ error: "Brak wiadomości od użytkownika." });
    }

    try {
        // Generowanie wektora osadzenia dla wiadomości użytkownika
        const embeddingResult = await embeddingModel.embedContent(userMessage);
        const userEmbedding = embeddingResult.embedding.values;

        //  Tutaj powinien znaleźć się kod do wyszukiwania semantycznie powiązanych fragmentów z bazy danych wektorowej
        //  ...

        // Tymczasowo, generujemy odpowiedź testową dla użytkownika
        const botResponse = `Otrzymałem twoją wiadomość: "${userMessage}". Twój wektor osadzenia to: [${userEmbedding.slice(0, 10).join(', ')}...]`;

        // Odpowiedź do klienta
        res.send({ response: botResponse });

    } catch (error) {
        console.error("Błąd w /chat:", error);
        res.status(500).send({ error: "Wystąpił błąd serwera podczas generowania odpowiedzi." });
    }
});


// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Serwer uruchomiony na porcie ${port}`);
});
