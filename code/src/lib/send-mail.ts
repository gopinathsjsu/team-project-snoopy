"use server";
import nodemailer from "nodemailer";
import fs from "node:fs/promises";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SMTP_SERVER_PORT = process.env.SMTP_SERVER_PORT ?? 465;
const transporter = nodemailer.createTransport({
  service: "mkgalaxy",
  host: SMTP_SERVER_HOST,
  port: SMTP_SERVER_PORT,
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
} as SMTPTransport.Options);

export const deleteFile = async (fileName: string) => {
  try {
    await fs.unlink(fileName);
  } catch (error) {
    console.error(`Error deleting folder "${fileName}":`, error);
  }
};

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
  files,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
  files?: any[];
}) {
  try {
    const isVerified = await transporter.verify();
    if (!isVerified) {
      return;
    }
  } catch (error) {
    console.error(
      "Something Went Wrong",
      SMTP_SERVER_USERNAME,
      SMTP_SERVER_PASSWORD,
      error
    );
    return;
  }
  const attachments = [];

  if (files && files?.length > 0) {
    for (const file of files) {
      attachments.push({ filename: file.name, path: file.path });
    }
  }
  const info = await transporter.sendMail({
    from: email,
    to: sendTo,
    subject: subject,
    text: text,
    html: html ?? "",
    attachments,
  });

  if (files && files?.length > 0) {
    for (const file of files) {
      await deleteFile(file.path);
    }
  }

  return info;
}
