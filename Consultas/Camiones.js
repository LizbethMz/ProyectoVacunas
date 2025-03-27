import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getCamiones, createCamion, updateCamion, deleteCamion } from '../api/CamionesApi';

const Camiones = () => {
  const [camionesData, setCamionesData] = useState([]); // Inicialmente vacío
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newCamion, setNewCamion] = useState({
    codigo: '',
    MMA: '',
    matricula: '',
    estado: '',
    cod_modelo: '',
    cod_marca: '',
  });

  // Función para cargar datos desde la API
  const fetchData = async () => {
    try {
      const data = await getCamiones(); // Llama a la función de la API
      setCamionesData(data); // Actualiza el estado con los datos recibidos
    } catch (error) {
      console.error('Error obteniendo datos de camiones:', error);
    }
  };

  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    if (editingIndex !== null) {
      try {
        // Actualizar camión existente en la API
        await updateCamion(newCamion.codigo, newCamion);
        fetchData(); // Recargar datos desde la API después de la actualización
        setEditingIndex(null);
      } catch (error) {
        console.error('Error actualizando camión:', error);
      }
    } else {
      try {
        // Registrar nuevo camión en la API
        await createCamion(newCamion);
        fetchData(); // Recargar datos desde la API después de agregar
      } catch (error) {
        console.error('Error registrando camión:', error);
      }
    }
    setNewCamion({ codigo: '', MMA: '', matricula: '', estado: '', cod_modelo: '', cod_marca: '' });
    setIsRegistering(false);
  };

  const handleEdit = (index) => {
    setNewCamion(camionesData[index]);
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      // Eliminar camión de la API
      const codigo = camionesData[index].codigo;
      await deleteCamion(codigo);
      fetchData(); // Recargar datos desde la API después de eliminar
    } catch (error) {
      console.error('Error eliminando camión:', error);
    }
  };

  const handleConsult = () => {
    fetchData(); // Recargar datos cuando se presiona "Consultar Información"
    setIsConsulting(true);
    setIsRegistering(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Camiones</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleConsult} // Usar handleConsult para actualizar la vista
      >
        <Text style={styles.buttonText}>Consultar Información</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsRegistering(true);
          setIsConsulting(false);
          setEditingIndex(null);
        }}
      >
        <Text style={styles.buttonText}>Registrar Camión</Text>
      </TouchableOpacity>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Camiones</Text>
          {camionesData.map((camion, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Código:</Text> {camion.codigo}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>MMA:</Text> {camion.MMA}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Matrícula:</Text> {camion.matricula}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Estado:</Text> {camion.estado}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Código Modelo:</Text> {camion.cod_modelo}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Código Marca:</Text> {camion.cod_marca}
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(index)}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {isRegistering && (
        <View style={styles.form}>
          <Text style={styles.subTitle}>{editingIndex !== null ? 'Editar Camión' : 'Registrar Nuevo Camión'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Código"
            value={newCamion.codigo}
            onChangeText={(text) => setNewCamion({ ...newCamion, codigo: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="MMA"
            value={newCamion.MMA}
            onChangeText={(text) => setNewCamion({ ...newCamion, MMA: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Matrícula"
            value={newCamion.matricula}
            onChangeText={(text) => setNewCamion({ ...newCamion, matricula: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Estado"
            value={newCamion.estado}
            onChangeText={(text) => setNewCamion({ ...newCamion, estado: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Código Modelo"
            value={newCamion.cod_modelo}
            onChangeText={(text) => setNewCamion({ ...newCamion, cod_modelo: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Código Marca"
            value={newCamion.cod_marca}
            onChangeText={(text) => setNewCamion({ ...newCamion, cod_marca: text })}
          />
          <Button title={editingIndex !== null ? 'Actualizar' : 'Registrar'} onPress={handleRegisterOrUpdate} />
        </View>
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'rgb(230, 242, 255)',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 16,
    color: '#005398',
  },
  label: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'rgb(0, 64, 128)',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#F0A500',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#D7263D',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  form: {
    width: '90%',
    padding: 20,
    backgroundColor: 'rgb(230, 242, 255)',
    borderRadius: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});

export default Camiones;
