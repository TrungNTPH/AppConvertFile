import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Pdf from "react-native-pdf";

export default function PdfPreview({ uri }: { uri: string }) {
  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri }}
        trustAllCerts={false}
        style={styles.pdf}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 10 },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  }
});
