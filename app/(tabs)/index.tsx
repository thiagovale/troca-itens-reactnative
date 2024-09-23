import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { addItem, getItems, removeItem } from '../../services/DatabaseService'; // ajuste o caminho conforme necessário

const ItemListScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);

  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (currentUser) {
      // Buscar itens do usuário logado
      const fetchItems = async () => {
        const userItems = await getItems(currentUser.uid);
        setItems(userItems);
      };

      fetchItems();
    }
  }, [currentUser]);

  const handleAddItem = async () => {
    if (currentUser) {
      const itemData = {
        title,
        description,
        ownerId: currentUser.uid,
        createdAt: new Date().toISOString(),
      };

      await addItem(itemData); // Adiciona o item
      setTitle(''); // Limpar campo
      setDescription(''); // Limpar campo

      // Atualizar a lista de itens
      const updatedItems = await getItems(currentUser.uid);
      setItems(updatedItems);
    } else {
      console.log('No user is logged in.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            await removeItem(itemId); // Remove o item
            // Atualiza a lista após remoção
            const updatedItems = await getItems(currentUser.uid);
            setItems(updatedItems);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Add Item" onPress={handleAddItem} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id} // Supondo que cada item tem um campo 'id'
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <Button title="Remove" onPress={() => handleRemoveItem(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  itemContainer: {
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 8,
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  itemDescription: {
    marginVertical: 4,
  },
});

export default ItemListScreen;
