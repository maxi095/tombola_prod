import Client from '../models/client.model.js';
import Person from '../models/person.model.js';

// Obtener todos los clientes con datos de persona
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .sort({ clientNumber: -1 }) // 1 = ascendente, -1 = descendente
      .populate('person');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un cliente por ID (incluye persona asociada)
export const getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('person');
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo cliente con su persona asociada
export const createClient = async (req, res) => {
  try {
    const {
      person: {
        firstName,
        lastName,
        document,
        address,
        city,
        phone,
        email
      },
      notes
    } = req.body;

    // Validar campos obligatorios
    if (!firstName || !lastName || !document) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const existingPerson = await Person.findOne({ document });
    if (existingPerson) {
      return res.status(400).json({ message: 'El documento ya fué registrado para otra persona' });
    }

    // Crear nueva persona
    const newPerson = new Person({
      firstName,
      lastName,
      document,
      address,
      city,
      phone,
      email
    });
    const savedPerson = await newPerson.save();

    // Generar número de cliente secuencial
    //const clientNumber = (await Client.countDocuments()) + 1;

    // Crear cliente asociado
    const newClient = new Client({
      person: savedPerson._id,
      notes
    });
    const savedClient = await newClient.save();

    // Popular datos para devolver con info completa
    const populatedClient = await Client.findById(savedClient._id).populate('person');

    res.status(201).json(populatedClient);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ message: "Error al crear cliente", error });
  }
};

// Actualizar un cliente (y su persona)
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    if (req.body.person) {
      await Person.findByIdAndUpdate(client.person, req.body.person, { new: true });
    }

    if (req.body.notes !== undefined) {
      client.notes = req.body.notes;
    }

    await client.save();

    const updatedClient = await Client.findById(req.params.id).populate('person');
    res.json(updatedClient);
  } catch (error) {
    console.error("Error en updateClient:", error);
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un cliente y su persona asociada
export const deleteClient = async (req, res) => {

  /*Se comenta codigo deleteClient ya que quitamos la acción del front

  /*try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    await Person.findByIdAndDelete(client.person);

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }*/
};
