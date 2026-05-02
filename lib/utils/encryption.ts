// Simulated encryption utilities for demonstration purposes
// In production, use proper cryptographic libraries

export function simulateEncrypt(text: string, algorithm: "AES-256" | "TLS-1.3" | "RSA-2048"): string {
  // Create a pseudo-encrypted output for demonstration
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
  let result = ""
  
  for (let i = 0; i < text.length * 2; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  // Add algorithm identifier
  const prefix = algorithm === "AES-256" ? "AES:" : algorithm === "TLS-1.3" ? "TLS:" : "RSA:"
  return prefix + result
}

export function getKeyExchangeSteps(algorithm: "AES-256" | "TLS-1.3" | "RSA-2048"): string[] {
  switch (algorithm) {
    case "AES-256":
      return [
        "1. Generate 256-bit symmetric key",
        "2. Create initialization vector (IV)",
        "3. Apply AES encryption in CBC mode",
        "4. Append HMAC for integrity verification",
        "5. Encode result in Base64",
      ]
    case "TLS-1.3":
      return [
        "1. Client sends ClientHello with supported cipher suites",
        "2. Server responds with ServerHello and certificate",
        "3. Key exchange using ECDHE (Elliptic Curve Diffie-Hellman)",
        "4. Both parties derive session keys",
        "5. Handshake verification with Finished messages",
        "6. Application data encrypted with derived keys",
      ]
    case "RSA-2048":
      return [
        "1. Generate RSA key pair (public/private)",
        "2. Share public key with sender",
        "3. Sender encrypts data with public key",
        "4. Transmit encrypted data",
        "5. Recipient decrypts with private key",
      ]
  }
}

export function generateHL7Message(patientName: string, heartRate: number, bp: string): string {
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0]
  return `MSH|^~\\&|VITALS|ICU|EHR|HOSPITAL|${timestamp}||ORU^R01|${Date.now()}|P|2.5
PID|1||MRN001^^^HOSP||${patientName.toUpperCase()}||19580315|M
OBR|1|||VITALS|||${timestamp}
OBX|1|NM|8867-4^HEART RATE^LN||${heartRate}|/min|60-100||||F
OBX|2|NM|85354-9^BLOOD PRESSURE^LN||${bp}|mmHg|||||F`
}

export function generateFHIRResource(patientId: string, heartRate: number): object {
  return {
    resourceType: "Observation",
    id: `obs-${Date.now()}`,
    status: "final",
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "vital-signs",
            display: "Vital Signs",
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "8867-4",
          display: "Heart rate",
        },
      ],
    },
    subject: {
      reference: `Patient/${patientId}`,
    },
    effectiveDateTime: new Date().toISOString(),
    valueQuantity: {
      value: heartRate,
      unit: "beats/minute",
      system: "http://unitsofmeasure.org",
      code: "/min",
    },
  }
}

export const encryptionInfo = {
  "AES-256": {
    name: "Advanced Encryption Standard (256-bit)",
    type: "Symmetric",
    keySize: "256 bits",
    use: "Data at rest, file encryption",
    strength: "Military-grade encryption",
  },
  "TLS-1.3": {
    name: "Transport Layer Security 1.3",
    type: "Hybrid (Asymmetric + Symmetric)",
    keySize: "Variable (typically 256-bit session keys)",
    use: "Data in transit, HTTPS connections",
    strength: "Current web security standard",
  },
  "RSA-2048": {
    name: "Rivest-Shamir-Adleman (2048-bit)",
    type: "Asymmetric",
    keySize: "2048 bits",
    use: "Key exchange, digital signatures",
    strength: "Secure until ~2030",
  },
}
