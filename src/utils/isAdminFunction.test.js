import { collection, query, where, getDocs } from '../Firebase';
import checkAdminStatus from './isAdminFunction';

jest.mock('../Firebase', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

describe('checkAdminStatus function', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return false for null currentUser', async () => {
    const currentUser = null;
    const isAdmin = await checkAdminStatus(currentUser);
    expect(isAdmin).toBe(false);
  });

  it('should return true if currentUser is admin', async () => {
    // Mocking Firestore behavior
    const mockQuerySnapshot = {
      forEach: jest.fn((callback) => {
        const doc = {
          data: () => ({ isAdmin: true, roles: ['admin'] }),
        };
        callback(doc);
      }),
    };

    collection.mockReturnValue({});
    query.mockReturnValue({});
    where.mockReturnValue({});
    getDocs.mockResolvedValue(mockQuerySnapshot);

    const currentUser = { uid: 'mockUserId' };
    const isAdmin = await checkAdminStatus(currentUser);
    expect(isAdmin).toBe(true);
  });

  it('should return false if currentUser is not admin', async () => {
    const mockQuerySnapshot = {
      forEach: jest.fn((callback) => {
        const doc = {
          data: () => ({ isAdmin: false, roles: ['user'] }),
        };
        callback(doc);
      }),
    };

    collection.mockReturnValue({});
    query.mockReturnValue({});
    where.mockReturnValue({});
    getDocs.mockResolvedValue(mockQuerySnapshot);

    const currentUser = { uid: 'mockUserId' };
    const isAdmin = await checkAdminStatus(currentUser);
    expect(isAdmin).toBe(false);
  });

  it('should return false if role isnt admin', async () => {
    const mockQuerySnapshot = {
      forEach: jest.fn((callback) => {
        const doc = {
          data: () => ({ isAdmin: true, roles: ['user'] }),
        };
        callback(doc);
      }),
    };

    collection.mockReturnValue({});
    query.mockReturnValue({});
    where.mockReturnValue({});
    getDocs.mockResolvedValue(mockQuerySnapshot);

    const currentUser = { uid: 'mockUserId' };
    const isAdmin = await checkAdminStatus(currentUser);
    expect(isAdmin).toBe(false);
  });

  it('should return false if isAdmin boolean is false', async () => {
    const mockQuerySnapshot = {
      forEach: jest.fn((callback) => {
        const doc = {
          data: () => ({ isAdmin: false, roles: ['admin'] }),
        };
        callback(doc);
      }),
    };

    collection.mockReturnValue({});
    query.mockReturnValue({});
    where.mockReturnValue({});
    getDocs.mockResolvedValue(mockQuerySnapshot);

    const currentUser = { uid: 'mockUserId' };
    const isAdmin = await checkAdminStatus(currentUser);
    expect(isAdmin).toBe(false);
  });
});