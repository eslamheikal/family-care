import { DbClient } from "./db-client";

export class DbCommands {

    protected collectionName: string;
    protected idField: string;

    constructor(collectionName: string, idField: string = 'id') {
        this.collectionName = collectionName;
        this.idField = idField;
    }

    protected getCollection() {
        return DbClient.collection(this.collectionName);
    }

    async create(data: Partial<any>): Promise<any> {
        try {
            // get the last document to know the next id
            const lastDoc = await this.getCollection().orderBy(this.idField, 'desc').limit(1).get();
            const lastId = lastDoc.docs[0]?.id ?? 0;
            const nextId = parseInt(lastId) + 1;

            const docRef = this.getCollection().doc(nextId.toString());
            const newData = { ...data, [this.idField]: nextId };
            await docRef.set(newData);
            return newData;
        } catch (error) {
            console.error(`Error creating ${this.collectionName}:`, error);
            throw error;
        }
    }

    async update(id: string | number, data: Partial<any>): Promise<any | null> {
        try {
            const docRef = this.getCollection().doc(String(id));
            const snapshot = await docRef.get();

            if (!snapshot.exists) {
                return null;
            }

            await docRef.update(data);
            const updatedSnapshot = await docRef.get();

            return {
                ...updatedSnapshot.data(),
                [this.idField]: updatedSnapshot.id,
            };

        } catch (error) {
            console.error(
                `Error updating document in collection "${this.collectionName}" with ID "${id}":`,
                error
            );
            throw error;
        }
    }

    async delete(id: string | number): Promise<boolean> {
        try {
            const docRef = this.getCollection().doc(String(id));
            const snapshot = await docRef.get();

            if (!snapshot.exists) {
                return false;
            }

            await docRef.delete();
            return true;
        } catch (error) {
            console.error(
                `Error deleting document in collection "${this.collectionName}" with ID "${id}":`,
                error
            );
            throw error;
        }
    }

}