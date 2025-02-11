import ToolService from "./application/services/ToolService";
import ToolController from "./infrastructure/api/controllers/tool.controller";

class Main {
  constructor() {}

  start = () => {
    const toolRepository = new ToolRepositoryImple();
    const toolService = new ToolService(toolRepository);
    const toolController = new ToolController(toolService);
  };
}
