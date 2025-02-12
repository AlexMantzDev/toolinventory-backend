import ToolService from "../../application/services/ToolService";
import ToolRepository from "../../domain/repositories/ToolRepository";
import Tool from "../../domain/models/Tool";
import ToolDTO from "../../application/dtos/ToolDTO";
import NotFoundError from "../../error/NotFoundError";

// Mock ToolRepository
const mockToolRepository: jest.Mocked<ToolRepository> = {
  save: jest.fn(),
  getById: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Create an instance of ToolService with the mocked repository
const toolService = new ToolService(mockToolRepository);

describe("ToolService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test("should add a new tool", async () => {
    const toolDTO: ToolDTO = { id: "1", name: "Hammer", status: "serviceable" };

    await toolService.addTool(toolDTO);

    expect(mockToolRepository.save).toHaveBeenCalledTimes(1);
    expect(mockToolRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1", name: "Hammer" })
    );
  });

  test("should find an existing tool", async () => {
    const tool = new Tool("2", "Wrench");
    mockToolRepository.getById.mockResolvedValue(tool);

    const result = await toolService.findTool("2");

    expect(result).toBe(tool);
    expect(mockToolRepository.getById).toHaveBeenCalledWith("2");
  });

  test("should throw NotFoundError when tool is not found", async () => {
    mockToolRepository.getById.mockResolvedValue(null);

    await expect(toolService.findTool("99")).rejects.toThrow(NotFoundError);
    expect(mockToolRepository.getById).toHaveBeenCalledWith("99");
  });
});
