import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    let projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    let clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    let privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
    
    // Check if firebase-credentials.json exists in backend root
    const credentialsPath = path.join(process.cwd(), 'firebase-credentials.json');
    if (fs.existsSync(credentialsPath)) {
      try {
        const fileContent = fs.readFileSync(credentialsPath, 'utf-8');
        const credentials = JSON.parse(fileContent);
        if (credentials.project_id && credentials.client_email && credentials.private_key) {
           projectId = credentials.project_id;
           clientEmail = credentials.client_email;
           privateKey = credentials.private_key;
        }
      } catch (err) {
        console.error('Failed to parse firebase-credentials.json', err);
      }
    }

    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Firebase Admin SDK config is missing. Google Auth will not work.');
      return;
    }

    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
  }

  async verifyIdToken(token: string): Promise<DecodedIdToken> {
    if (getApps().length === 0) {
      throw new Error('Firebase Admin not initialized');
    }
    return getAuth().verifyIdToken(token);
  }
}
