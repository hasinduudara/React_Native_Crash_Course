import { Image, ScrollView, Text, View, StyleSheet, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router"; // Removed Link, added useRouter
import { SafeAreaView } from "react-native-safe-area-context";
import { TestIds, useRewardedAd } from 'react-native-google-mobile-ads';

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

// 1. Setup the Ad Unit ID
// We use the Test ID when in development mode (Expo Go or Dev Client) to avoid bans.
// We use your REAL ID when building the app for release.
const adUnitId = __DEV__
    ? TestIds.REWARDED
    : 'ca-app-pub-7029214467070565/4784004497';

export default function Index() {
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const router = useRouter(); // Use router for manual navigation

    // 2. Initialize the Ad
    const { isLoaded, isClosed, load, show } = useRewardedAd(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
    });

    // Keep track of where the user wanted to go
    const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(null);

    useEffect(() => {
        fetchPokemon();
        load(); // Start loading an ad as soon as the screen opens
    }, [load]);

    // 3. Watch for the Ad to Close
    useEffect(() => {
        if (isClosed && selectedPokemonName) {
            // The user finished the ad, now we navigate
            router.push({ pathname: "/details", params: { name: selectedPokemonName } });

            // Clean up and load a NEW ad for the next click
            setSelectedPokemonName(null);
            load();
        }
    }, [isClosed, selectedPokemonName, load]);

    async function fetchPokemon() {
        try {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=10");
            const data = await response.json();

            const datailedPokemon = await Promise.all(
                data.results.map(async (pokemon: any) => {
                    const res = await fetch(pokemon.url);
                    const details = await res.json();
                    return {
                        name: pokemon.name,
                        image: details.sprites.front_default,
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

    // 4. Handle the Card Click
    const handlePress = (name: string) => {
        setSelectedPokemonName(name);

        if (isLoaded) {
            // Ad is ready? Show it! (Navigation happens in the useEffect above)
            show();
        } else {
            // Ad failed or internet slow? Don't block the user, just navigate.
            router.push({ pathname: "/details", params: { name } });
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
            <ScrollView
                contentContainerStyle={{
                    gap: 16,
                    padding: 16,
                }}
            >
                {pokemon.map((pokemon) => (
                    <Pressable
                        key={pokemon.name}
                        onPress={() => handlePress(pokemon.name)}
                        style={({ pressed }) => ({
                            // @ts-ignore
                            backgroundColor: colorByType[pokemon.types[0].type.name] + 50,
                            padding: 20,
                            borderRadius: 20,
                            // Optional: add a visual effect when touching
                            opacity: pressed ? 0.8 : 1
                        })}
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
                    </Pressable>
                ))}
            </ScrollView>
        </SafeAreaView>
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