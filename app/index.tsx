import { ScrollView, Text, View } from "react-native";
import {useEffect, useState} from "react";

export default function Index() {
    const [pokemon, setPokemon] = useState([]);

    useEffect(() => {
        // fetch pokemon
        fetchPokemon()
    }, []);

    async function fetchPokemon() {
        try {
            const response = await fetch(
                "https://pokeapi.co/api/v2/pokemon/?limit=10"
            );
            const data = await response.json();
            setPokemon(data.results);
        } catch (error) {
            console.log(error)

        }
    }

  return (
    <ScrollView>
        {pokemon.map((pokemon) => (
            <View key={pokemon.name}>
                <Text>{pokemon.name}</Text>
            </View>
        ))}
    </ScrollView>
  );
}
