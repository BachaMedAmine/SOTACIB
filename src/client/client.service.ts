import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AjouterClientDto } from './dto/ajouterClient.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from './schema/client.schema';
import { Model } from 'mongoose';
import { Gouvernorat } from '../gouvernorat/schema/gouvernorat.schema';
import { Delegation } from '@/delegation/schema/delegation.schema';
import { Concurent } from '@/concurent/schema/concurent.schema';
import { Produit } from '@/produit/schema/produit.schema';
import { VisiteService } from 'src/visite/visite.service';
import { Visite } from 'src/visite/schemas/visite.schema'

@Injectable()
export class ClientService {

  constructor(
    @InjectModel(Visite.name) private readonly visiteModel: Model<Visite>, // Ensure VisiteModel is injected

    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Gouvernorat.name) private gouvernoratModel: Model<Gouvernorat>,
    @InjectModel(Delegation.name) private delegationModel: Model<Delegation>,
    @InjectModel(Concurent.name) private concurentModel: Model<Concurent>,
    @InjectModel(Produit.name) private produitModel: Model<Produit>,
  ) { }

  async create(ajouterClientDto: AjouterClientDto): Promise<{ client }> {
    const {
      responsable,
      clientNom,
      email,
      clientType,
      telephone,
      address,
      gouvernoratId,
      delegationId,
      produits,
    } = ajouterClientDto;
  
    try {
      console.log('Start creating client with DTO:', ajouterClientDto);
  
      // Check for an existing client
      const existingClient = await this.clientModel.findOne({ responsable });
      if (existingClient) {
        console.log('Client with the same responsable already exists:', responsable);
        throw new ConflictException('Client existe déjà');
      }
  
      console.log('Client with responsable does not exist, proceeding.');
  
      // Verify gouvernorat existence
      const gouvernorat = await this.gouvernoratModel.findById(gouvernoratId);
      if (!gouvernorat) {
        console.log('Gouvernorat not found:', gouvernoratId);
        throw new NotFoundException('Gouvernorat non trouvé');
      }
      console.log('Found gouvernorat:', gouvernorat);
  
      // Verify delegation existence
      const delegation = await this.delegationModel.findById(delegationId);
      if (!delegation || !delegation.gouvernorat.equals(gouvernoratId)) {
        console.log('Delegation not found or does not belong to gouvernorat:', delegationId);
        throw new NotFoundException('Delegation non trouvée ou n’appartient pas au gouvernorat');
      }
      console.log('Found delegation:', delegation);
  
      // Validate produits
      const validatedProduits = [];
      for (const { concurentId, produitId, prix } of produits) {
        console.log('Validating produit:', { concurentId, produitId, prix });
  
        const concurent = await this.concurentModel.findById(concurentId);
        if (!concurent) {
          console.log('Concurent not found:', concurentId);
          throw new NotFoundException('Concurent not found');
        }
        console.log('Found concurent:', concurent);
  
        const produit = await this.produitModel.findOne({ _id: produitId, concurent: concurentId });
        if (!produit) {
          console.log('Produit not found or does not belong to concurent:', produitId);
          throw new NotFoundException('Produit non trouvé ou n’appartient pas au concurent');
        }
        console.log('Found produit:', produit);
  
        validatedProduits.push({ concurent: concurentId, produit: produitId, prix });
      }
      console.log('Validated produits:', validatedProduits);
  
      // Create and save the client
      console.log('Creating client...');
      const client = await this.clientModel.create({
        responsable,
        clientNom,
        clientType,
        email,
        telephone,
        address,
        gouvernorat: gouvernoratId,
        delegation: delegationId,
        produits: validatedProduits,
      });
  
      console.log('Client created successfully:', client);
  
      return { client };
    } catch (error) {
        console.error('Error while creating client:', error);
      
        // Narrow the type of error to handle it correctly
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Stack trace:', error.stack);
          throw new Error(error.message || 'Error while creating client');
        } else {
          console.error('Unknown error type:', error);
          throw new Error('An unknown error occurred while creating the client');
        }
      }
  }
  async findById(clientId: string): Promise<any> {
    console.log(`Fetching client with ID: ${clientId}`);
  
    const client = await this.clientModel
      .findById(clientId)
      .populate('gouvernorat', 'nom') // Populate Gouvernorat name
      .populate('delegation', 'nom') // Populate Delegation name
      .populate({
        path: 'visites', // Populate the `visites` field
        populate: [
          {
            path: 'cimenteries.cimenterie', // Populate each cimenterie in visites
            select: 'nom abreviation',
          },
          {
            path: 'cimenteries.produits.produit', // Populate each produit in visites
            select: 'nom prix',
          },
        ],
      })
      .exec();
  
    if (!client) {
      console.error(`Client with ID ${clientId} not found.`);
      throw new NotFoundException('Client not found');
    }
  
    console.log('Client found:', JSON.stringify(client, null, 2));
  
    // Safely handle `visites` if it's not populated or empty
    const visites = Array.isArray(client.visites)
      ? client.visites.map((visite: any) => ({
          date: visite.date,
          observation: visite.observation,
          reclamation: visite.reclamation,
          responsable: visite.responsable,
          pieceJoint: visite.pieceJoint,
          cimenteries: visite.cimenteries.map((cimenterie: any) => ({
            cimenterie: cimenterie.cimenterie,
            produits: cimenterie.produits.map((produit: any) => ({
              produit: produit.produit,
              prix: produit.prix,
            })),
          })),
        }))
      : []; // Default to an empty array if `visites` is not defined
  
    return {
      ...client.toObject(),
      visites,
    };
  }

  findAll() {
    return //This action returns all client;
  }

  findOne(id: number) {
    return //This action returns a #${id} client;
  }

  update(id: number, updateClientDto: AjouterClientDto) {
    return //This action updates a #${id} client;
  }

  remove(id: number) {
    return //This action removes a #${id} client;
  }
  
}
