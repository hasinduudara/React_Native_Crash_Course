import { ScrollView, View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

const colorByType: any = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    steel: "#B7B7CE",
    dark: "#705746",
    fairy: "#D685AD",
};

export default function Details() {
    const params = useLocalSearchParams()
    const name = params.name as string

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPokemonByName(name)
    }, [])

    async function fetchPokemonByName(name: string) {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const json = await res.json();
            setData(json);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }

    if (loading || !data) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const mainType = data.types[0].type.name;

    return (
        <>
            <Stack.Screen options={{ title: name.toUpperCase() }} />

            <ScrollView contentContainerStyle={styles.container}>
                <Image
                    source={{ uri: data.sprites.front_default }}
                    style={{ width: 200, height: 200 }}
                />

                <Text style={styles.title}>{name.toUpperCase()}</Text>

                <View
                    style={{
                        backgroundColor: colorByType[mainType],
                        paddingHorizontal: 20,
                        paddingVertical: 8,
                        borderRadius: 20,
                        marginTop: 10,
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
                        {mainType}
                    </Text>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center",
        gap: 20,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
    },
});