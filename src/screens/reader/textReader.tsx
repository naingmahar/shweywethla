import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
} from "react-native";
import RNFS from "react-native-fs";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const TextReaderPage = ({path}:{path:string}) => {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const flatListRef = useRef<FlatList<string>>(null);

  useEffect(() => {
    const loadText = async () => {
      try {
        // ANDROID: android/app/src/main/assets/book.txt
        // const content = await RNFS.readFileAssets("page_1.text", "utf8");
        const content = await RNFS.readFile(path, "utf8");

        // Split paragraphs
        const paragraphs = content
          .split("---")
          .map((p) => p.trim())
          .filter((p) => p.length > 0);

        setPages(paragraphs);
      } catch (err) {
        console.error("Error reading text file:", err);
      }
    };

    loadText();
  }, []);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(index);
  };

  const renderItem = ({ item }: { item: string }) => {
        // 🧹 Clean up line breaks
    const cleanText = item
      .replace(/\r?\n|\r/g, " ")  // remove enters
      .replace(/\s{2,}/g, " ");   // collapse spaces

    // Split into paragraphs by ---
    const paragraphs = cleanText
      .split("---")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    return (
        <View style={styles.page}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.paragraph}>{
            paragraphs.toString().replace(/--next--/g,"\n")
            }</Text>
        </ScrollView>
        </View>
    );
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📖 My Book Title</Text>
      </View>

      {/* Reader Pages */}
      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.pageNumber}>
          Page {currentPage + 1} / {pages.length}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  page: {
    width,
    // minHeight: height - 110, // leave space for header + footer
    padding: 20,
    // paddingBottom: 40,
    marginVertical: 10,
    // justifyContent: "center",
    // alignItems: "center",
  },
  paragraph: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight:40,
     color: "#333",
    textAlign: "auto",
  },
  footer: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  pageNumber: {
    fontSize: 16,
    color: "#666",
  },
});

export default TextReaderPage;
