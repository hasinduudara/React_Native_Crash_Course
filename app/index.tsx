import { Image, ScrollView, Text, View, StyleSheet, Pressable } from "react-native";
import {useEffect, useState} from "react";
import {Link} from "expo-router";

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
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    steel: '#B7B7CE',
    dark: '#705746',
    fairy: '#D685AD',
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
            <Link key={pokemon.name}
                  href={{ pathname: "/details" , params: { name: pokemon.name } }}
                  style={{
                      // @ts-ignore
                      backgroundColor: colorByType[pokemon.types[0].type.name] + 50,
                      padding: 20,
                      borderRadius: 20,
                  }}
            >
                <View>
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
            </Link>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    name: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
    },
    type: {
        fontSize: 20,
        fontWeight: "bold",
        color: "gray",
        textAlign: "center",
    }
});