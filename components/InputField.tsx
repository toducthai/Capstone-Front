import * as React from "react";
import {StyleSheet, Text, View, TextInput} from "react-native";

type InputField = {
    title: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
};

const InputField: React.FC<InputField> = ({title, value, onChangeText, secureTextEntry}) => {
    return(
        <View style={styles.view}>
            <Text style={styles.text}>{title}</Text>
            <TextInput
                style={styles.child}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    view:{
        //flex: 1,
        width: "100%",
        overflow: "hidden",
        paddingHorizontal: 16,
        paddingVertical: 0,
        gap: 4
    },
    text:{
        fontSize: 15,
        fontWeight: "500",
        color: "#000",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        width: 179,
        height: 24
    },
    child:{
        alignSelf: "stretch",
        borderRadius: 6,
        backgroundColor: "#d9d9d9",
        height: 50
    }
});

export default InputField;