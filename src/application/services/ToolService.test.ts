import ToolService from "../../application/services/ToolService";
import ToolDTO from "../../application/dtos/ToolDTO";
import NotFoundError from "../../error/NotFoundError";
import ToolEntity from "../../infrastructure/persistence/entities/ToolEntity";
import ToolRepository from "../repositories/ToolRepository";
import Tool from "../../domain/models/Tool";
import DAO from "../../domain/daos/DAO";

// Mock ToolDAO
const mockToolDAO: jest.Mocked<DAO<Tool, ToolEntity>> = {
  save: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Mock ToolRepository
const toolRepository = new ToolRepository(mockToolDAO);

// Create an instance of ToolService with the mocked repository
const toolService = new ToolService(toolRepository);

describe("ToolService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test("should add a new tool", async () => {
    const toolDTO: ToolDTO = { id: "1", name: "Hammer", status: "serviceable" };

    await toolService.create(toolDTO);

    expect(mockToolDAO.save).toHaveBeenCalledTimes(1);
    expect(mockToolDAO.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1", name: "Hammer" })
    );
  });

  test("should find an existing tool", async () => {
    const tool = new ToolEntity(
      "2",
      "Wrench",
      "serviceable",
      new Date(Date.now()),
      new Date(Date.now())
    );
    mockToolDAO.getById.mockResolvedValue(tool);

    const result = await toolService.findById("2");

    expect(result).toBe(tool);
    expect(mockToolDAO.getById).toHaveBeenCalledWith("2");
  });

  test("should throw NotFoundError when tool is not found", async () => {
    mockToolDAO.getById.mockResolvedValue(null);

    await expect(toolService.findById("99")).rejects.toThrow(NotFoundError);
    expect(mockToolDAO.getById).toHaveBeenCalledWith("99");
  });
});
