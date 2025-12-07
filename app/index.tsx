import { Image, ScrollView, Text, View, StyleSheet } from "react-native";
import {useEffect, useState} from "react";

interface Pokemon {
    name: string;
    image: string;
    imageBack: string;
    types: PokemonType[];
}

interface PokemonType {
    type: {
        name: string;
        url: string;
    }
}

const colorByType = {
    grass: "green",
    fire: "orange",
    water: "blue",
    bug: "lightgreen",
}

export default function Index() {
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);

    console.log(JSON.stringify(pokemon[0], null, 2))


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
                        types: details.types,
                    };
                })
            );

            setPokemon(datailedPokemon);
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <ScrollView
        contentContainerStyle={{
            gap: 16,
            padding: 16,
        }}
    >
        {pokemon.map((pokemon) => (
            <View key={pokemon.name} style={{
                // @ts-ignore
                backgroundColor: colorByType[pokemon.types[0].type.name],
            }}>
                <Text style={styles.name}>{pokemon.name}</Text>

                <Text style={styles.type}>{pokemon.types[0].type.name}</Text>

                <View style={{
                    flexDirection: 'row',
                }}>
                    <Image
                        source={{ uri: pokemon.image }}
                        style={{ width: 150, height: 150 }}
                    />
                    <Image
                        source={{ uri: pokemon.imageBack }}
                        style={{ width: 150, height: 150 }}
                    />
                </View>
            </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    name: {
        fontSize: 28,
        fontWeight: "bold",
    },
    type: {
        fontSize: 20,
        fontWeight: "bold",
        color: "gray",
    }
});