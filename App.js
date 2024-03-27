import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import { useFonts } from 'expo-font';

// Lista de palavras possíveis
const words = [
  'apple', 'banana', 'orange', 'grape', 'pear',
  'lemon', 'melon', 'peach', 'plum', 'kiwi',
  'apricot', 'cherry', 'olive', 'guava', 'mango'
];

export default function App() {

  let [fontsLoaded] = useFonts({
    'Mariana': require('./assets/fonts/Satoshi-Black.otf'),
    'Mariana': require('./assets/fonts/Satoshi-Regular.otf'),
    'Mariana': require('./assets/fonts/Satoshi-Light.otf'),
    'Mariana': require('./assets/fonts/Satoshi-Black.otf'),
    'Mariana': require('./assets/fonts/Satoshi-Black.otf'),
    'Mariana': require('./assets/fonts/Satoshi-Black.otf'),
  });
  
  if (!fontsLoaded) {
    return null;
  }

  const [secretWord, setSecretWord] = useState('');
  const [guess, setGuess] = useState('');
  const [round, setRound] = useState(1);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [feedback, setFeedback] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Iniciar um novo jogo
  useEffect(() => {
    startNewGame();
  }, []);

  // Escolher uma nova palavra secreta
  function chooseSecretWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  // Iniciar um novo jogo
  function startNewGame() {
    const newSecretWord = chooseSecretWord();
    setSecretWord(newSecretWord);
    setGuess('');
    setRound(1);
    setAttemptsLeft(5);
    setFeedback([]);
    setGameOver(false);
  }

  // Verificar o palpite
  function checkGuess() {
    if (gameOver || attemptsLeft === 0) return;

    const guessWord = guess.toLowerCase();
    let correctLetters = 0;
    let correctPositions = 0;

    for (let i = 0; i < secretWord.length; i++) {
      if (guessWord[i] === secretWord[i]) {
        correctPositions++;
      } else if (secretWord.includes(guessWord[i])) {
        correctLetters++;
      }
    }

    const guessResult = {
      guess: guessWord,
      correctLetters,
      correctPositions
    };

    setFeedback([...feedback, guessResult]);
    setGuess('');
    setAttemptsLeft(attemptsLeft - 1);

    if (correctPositions === 5) {
      setGameOver(true);
      Alert.alert('Parabéns!', 'Você acertou a palavra secreta!', [{ text: 'OK', onPress: startNewRound }]);
    } else if (attemptsLeft === 1) {
      if (round < 5) {
        Alert.alert('Tente novamente', 'Você não conseguiu adivinhar a palavra secreta. Tente na próxima rodada.', [{ text: 'OK', onPress: startNewRound }]);
      } else {
        Alert.alert('Fim do Jogo', 'Você não conseguiu adivinhar a palavra secreta em todas as rodadas. Reinicie o jogo.', [{ text: 'OK', onPress: startNewGame }]);
      }
    }
  }

  // Iniciar uma nova rodada
  function startNewRound() {
    if (round < 5) {
      setRound(round + 1);
      setAttemptsLeft(5);
      setFeedback([]);
      setSecretWord(chooseSecretWord());
      setGameOver(false);
    } else {
      startNewGame();
    }
  }

  // Validar entrada para aceitar apenas 5 letras
  function validateInput(text) {
    // Expressão regular para verificar se a entrada contém exatamente 5 letras
    const regex = /^[a-zA-Z]{0,5}$/;
    if (regex.test(text) || text === '') {
      setGuess(text);
    }
  }

  // Renderizar os quadrados de feedback para cada tentativa
  function renderFeedbackSquares() {
    const allFeedbackSquares = [];
    for (let i = 0; i < 5; i++) {
      const feedbackSquares = [];
      const feedbackItem = feedback[i];
      if (feedbackItem) {
        const guessLetters = feedbackItem.guess.split('');
        for (let j = 0; j < 5; j++) {
          let backgroundColor = 'lightgrey';
          if (j < guessLetters.length) {
            const guessLetter = guessLetters[j];
            if (guessLetter === secretWord[j]) {
              backgroundColor = 'green';
            } else if (secretWord.includes(guessLetter)) {
              backgroundColor = 'yellow';
            }
          }
          feedbackSquares.push(
            <View key={j} style={{ backgroundColor, width: 30, height: 30, margin: 3, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 16,  fontFamily: 'Mariana', fontWeight: 'bold' }}>{guessLetters[j] ? guessLetters[j].toUpperCase() : ''}</Text>
            </View>
          );
        }
      }
      allFeedbackSquares.push(
        <View key={i} style={{ flexDirection: 'row', marginTop: 10 }}>     fontFamily: 'Mariana',
          {feedbackSquares}
        </View>
      );
    }
    return allFeedbackSquares;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', fontFamily: 'Mariana', alignItems: 'center' }}>
      {!gameOver && (
        <>
          <Text>Round: {round}</Text>
          <Text>Attempts Left: {attemptsLeft > 0 ? attemptsLeft : 0}</Text>
          <View style={{ marginTop: 10 }}>
            {renderFeedbackSquares()}
          </View>
          <TextInput
            style={{ height: 40, borderColor: 'gray', fontFamily: 'Mariana', borderWidth: 1, marginTop: 10, marginBottom: 10, paddingHorizontal: 10 }}
            onChangeText={validateInput}
            value={guess}
            editable={attemptsLeft > 0}
            maxLength={5} // Limitar a 5 caracteres
          />
          <Button title="Check Guess" onPress={checkGuess} disabled={attemptsLeft === 0} />
        </>
      )}
      {gameOver && (
        <>
          <Text>Secret Word: {secretWord}</Text>
          <Button title="Start New Game" onPress={startNewGame} />
        </>
      )}
    </View>
  );
}
