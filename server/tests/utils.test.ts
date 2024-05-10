import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import BadRequest from "../errors/bad-request";
import UnauthenticatedError from "../errors/unauthenticated";
import { createToken, isTokenExpired, verifyToken } from "../utils/JWT";
import exclude from "../utils/exclude_property";
import { send_mail } from "../utils/send_mail";

jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({
        sendMail: jest.fn(),
    })),
}));

jest.mock('jsonwebtoken');

describe('utils suite', () => {

    describe('exclude_property', () => {
        it('should exclude specified keys', () => {
            const sut = exclude;
            const user: User = {
                name: 'akash',
                email: 'ak@g.com',
                id: 1,
                password: 'abv',
                phone_number: '534',
                transactions: {},
                isHighSpender: false
            };
            const keys: (keyof User)[] = ['password', 'isHighSpender'];
            const expected = {
                name: 'akash',
                email: 'ak@g.com',
                id: 1,
                phone_number: '534',
                transactions: {},
            };

            const actual = sut(user, keys);
            expect(actual).toEqual(expected);
        });

        it('should return same obj if no keys provided', () => {
            const sut = exclude;
            const user: User = {
                name: 'akash',
                email: 'ak@g.com',
                id: 1,
                password: 'abv',
                phone_number: '534',
                transactions: {},
                isHighSpender: false
            };
            const keys: (keyof User)[] = [];

            const expected = user;
            const actual = sut(user, keys);

            expect(actual).toEqual(expected);

        });
    });

    describe('JWT', () => {
        it('createToken should call jwt.sign with correct parameters and return a token', () => {
            const sut = createToken;

            const mockUser: Partial<User> = {
                name: 'Test User',
                email: 'test@example.com',
                phone_number: '1234567890',
                isHighSpender: false,
            };
            const expected = 'mockToken';
            (jwt.sign as jest.Mock).mockReturnValue(expected);

            const actual = sut(mockUser as User);

            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    name: mockUser.name,
                    email: mockUser.email,
                    phone_number: mockUser.phone_number,
                    isHighSpender: mockUser.isHighSpender,
                },
                process.env.JWT_SECRET_KEY!,
                { expiresIn: "5h" }
            );
            expect(actual).toBe(expected);
        });

        let mockRequest: Partial<Request>;
        let mockResponse: Partial<Response>;
        let mockNextFunction: NextFunction;

        beforeEach(() => {
            mockRequest = {
                cookies: {},
                headers: {}
            };
            mockResponse = {
                locals: {}
            };
            mockNextFunction = jest.fn();
        });

        it('verifyToken should throw UnauthenticatedError if no token passed', () => {
            expect(() => verifyToken(mockRequest as Request, mockResponse as Response, mockNextFunction))
                .toThrow(UnauthenticatedError);
        });

        it('verifyToken should throw BadRequest if jwt is not verified', () => {
            (jwt.verify as jest.Mock).mockReturnValue(null);
            mockRequest.cookies['access-token'] = 'mock-token';

            expect(() => verifyToken(mockRequest as Request, mockResponse as Response, mockNextFunction))
                .toThrow(BadRequest);
        });

        it('verifyToken should set res.locals.authenticated and res.locals.user and call next if jwt.verify returns a user', () => {
            const sut = verifyToken;
            const mockUser: Partial<User> = {
                name: 'Test User',
                email: 'test@example.com',
                phone_number: '1234567890',
                isHighSpender: false,
            };

            mockRequest.cookies['access-token'] = 'mock-token';
            (jwt.verify as jest.Mock).mockReturnValue(mockUser);
            sut(mockRequest as Request, mockResponse as Response, mockNextFunction);

            expect(mockResponse.locals.authenticated).toBe(true);
            expect(mockResponse.locals.user).toEqual(mockUser);
            expect(mockNextFunction).toHaveBeenCalled();

        });

        it('isTokenExpired should return true if token is expired', () => {
            const sut = isTokenExpired;
            const mockToken = 'access-token';
            (jwt.decode as jest.Mock).mockReturnValue({
                exp: Math.floor(Date.now() / 1000) - 60
            });
            const expected = true;
            const actual = sut(mockToken);
            expect(actual).toBe(expected);
        });

        it('isTokenExpired should return false if token is not expired', () => {
            const sut = isTokenExpired;
            const mockToken = 'access-token';
            (jwt.decode as jest.Mock).mockReturnValue({
                exp: Math.floor(Date.now() / 1000) + 60
            });
            const expected = false;
            const actual = sut(mockToken);
            expect(actual).toBe(expected);
        });

        it('isTokenExpired should return undefined if decoded token is a string', () => {
            const sut = isTokenExpired;
            const mockToken = 'access-token';

            (jwt.decode as jest.Mock).mockReturnValue('string');
            const expected = undefined;

            const actual = sut(mockToken);
            expect(actual).toBe(expected);
        });

        it('isTokenExpired should return undefined if decoded token is null', () => {
            const sut = isTokenExpired;
            const mockToken = 'access-token';

            (jwt.decode as jest.Mock).mockReturnValue(null);
            const expected = undefined;

            const actual = sut(mockToken as unknown as string);
            expect(actual).toBe(expected);
        });
    });

    describe('send_mail', () => {
        let sendMailMock: jest.Mock;

        beforeEach(() => {
            sendMailMock = jest.fn();
            (nodemailer.createTransport as jest.Mock).mockReturnValue({
                sendMail: sendMailMock,
            });
        });

        it('should return true if mail is sent', async () => {
            const sut = send_mail;
            sendMailMock.mockImplementation((_mailOptions, callback) => {
                callback(null, 'Email sent');
            });
            const expected = true;

            const actual = await sut('test@example.com', 'key', 123);
            expect(actual).toBe(expected);
        });

        it('should return false if mail is not sent', async () => {
            const sut = send_mail;
            sendMailMock.mockImplementation((_mailOptions, callback) => {
                callback(new Error('Failed to send email'), null);
            });
            const expected = false;

            const actual = await sut('test@example.com', 'key', 123);
            expect(actual).toBe(expected);
        });
    });
});
