import { Image, ScrollView, Text, View } from "react-native";
import {useEffect, useState} from "react";

interface Pokemon {
    name: string;
    image: string;
    imageBack: string;
}

export default function Index() {
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);

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

            // set detailed info for each pokemon in parallel
            const datailedPokemon = await Promise.all(
                data.results.map(async (pokemon: any) => {
                    const res = await fetch(pokemon.url);
                    const details = await res.json();
                    return {
                        name: pokemon.name,
                        image: details.sprites.front_default, // main sprite
                        imageBack: details.sprites.back_default,
                    };
                })
            );

            setPokemon(datailedPokemon);
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <ScrollView>
        {pokemon.map((pokemon) => (
            <View key={pokemon.name}>
                <Text>{pokemon.name}</Text>
                <Image
                    source={{ uri: pokemon.image }}
                    style={{ width: 150, height: 150 }}
                />
                <Image
                    source={{ uri: pokemon.imageBack }}
                    style={{ width: 150, height: 150 }}
                />
            </View>
        ))}
    </ScrollView>
  );
}
