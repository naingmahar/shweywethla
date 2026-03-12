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
import { useAtom } from "jotai";
import { darkModeAtom } from "../../features/jotai/model/darkMode";

const { width, height } = Dimensions.get("window");

const TextReaderPage = ({path}:{path:string}) => {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [darkMode] = useAtom(darkModeAtom);
  const enabled = darkMode ?? false;

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
    const cleanText = item
      .replace(/\r?\n|\r/g, " ")
      .replace(/\s{2,}/g, " ");

    const paragraphs = cleanText
      .split("---")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    return (
      <View style={[styles.page, enabled ? styles.pageDark : styles.pageLight]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.paragraph, enabled ? styles.paragraphDark : styles.paragraphLight]}>
            {paragraphs.toString().replace(/--next--/g, "\n")}
          </Text>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, enabled ? styles.containerDark : styles.containerLight]}>
      {/* Header */}
      <View style={[styles.header, enabled ? styles.headerDark : styles.headerLight]}>
        <Text style={[styles.title, enabled ? styles.titleDark : styles.titleLight]}>My Book Title</Text>
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
      <View style={[styles.footer, enabled ? styles.footerDark : styles.footerLight]}>
        <Text style={[styles.pageNumber, enabled ? styles.pageNumberDark : styles.pageNumberLight]}>
          Page {currentPage + 1} / {pages.length}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerLight: { backgroundColor: "#fcf7ea" },
  containerDark: { backgroundColor: "#121212" },

  header: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  headerLight: { backgroundColor: "#fcf7ea", borderBottomColor: "#ddd" },
  headerDark:  { backgroundColor: "#1e1e1e", borderBottomColor: "#333" },

  title: { fontSize: 20, fontWeight: "bold" },
  titleLight: { color: "#333" },
  titleDark:  { color: "#e1e1e1" },

  page: { width, padding: 20, marginVertical: 10 },
  pageLight: { backgroundColor: "#fcf7ea" },
  pageDark:  { backgroundColor: "#121212" },

  paragraph: { fontSize: 18, fontWeight: "600", lineHeight: 40, textAlign: "auto" },
  paragraphLight: { color: "#333" },
  paragraphDark:  { color: "#e1e1e1" },

  footer: { height: 50, justifyContent: "center", alignItems: "center", borderTopWidth: 1 },
  footerLight: { backgroundColor: "#fcf7ea", borderTopColor: "#ddd" },
  footerDark:  { backgroundColor: "#1e1e1e", borderTopColor: "#333" },

  pageNumber: { fontSize: 16 },
  pageNumberLight: { color: "#666" },
  pageNumberDark:  { color: "#aaa" },
});

export default TextReaderPage;
