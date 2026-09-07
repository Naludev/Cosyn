import { Router, type IRouter } from "express";
import healthRouter from "./health";
import cosynRouter from "./cosyn";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cosynRouter);

export default router;
