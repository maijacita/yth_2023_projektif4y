import { collection, query, where, getDocs } from '../Firebase';
import CheckBlockStatus from './isUserBlockedFunction'; // Replace with the correct path to your function file

jest.mock('../Firebase', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

describe('CheckBlockStatus function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return false for null currentUser', async () => {
    const currentUser = null;
    const isBlocked = await CheckBlockStatus(currentUser);
    expect(isBlocked).toBe(false);
  });

  it('should return true if currentUser is blocked', async () => {
    const mockQuerySnapshot = {
      forEach: jest.fn((callback) => {
        const doc = {
          data: () => ({ isBlocked: true }),
        };
        callback(doc);
      }),
    };

    collection.mockReturnValue({});
    query.mockReturnValue({});
    where.mockReturnValue({});
    getDocs.mockResolvedValue(mockQuerySnapshot);

    const currentUser = { uid: 'mockUserId' };
    const isBlocked = await CheckBlockStatus(currentUser);
    expect(isBlocked).toBe(true);
  });

  it('should return false if currentUser is not blocked', async () => {
    const mockQuerySnapshot = {
      forEach: jest.fn((callback) => {
        const doc = {
          data: () => ({ isBlocked: false }),
        };
        callback(doc);
      }),
    };

    collection.mockReturnValue({});
    query.mockReturnValue({});
    where.mockReturnValue({});
    getDocs.mockResolvedValue(mockQuerySnapshot);

    const currentUser = { uid: 'mockUserId' };
    const isBlocked = await CheckBlockStatus(currentUser);
    expect(isBlocked).toBe(false);
  });
});
