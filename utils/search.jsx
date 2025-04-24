// utils/search.jsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const Search = ({ restaurantData, onSearchResults }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (text) => {
    setQuery(text);
    if (!text.trim()) {
      onSearchResults(restaurantData);
      return;
    }
    const results = restaurantData.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(text.toLowerCase())
    );
    onSearchResults(results);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search restaurants..."
        value={query}
        onChangeText={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
});

export default Search;