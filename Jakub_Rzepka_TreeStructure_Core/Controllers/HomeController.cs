using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Jakub_Rzepka_TreeStructure_Core.Models;
using Jakub_Rzepka_TreeStructure_Core.Repositories;
using Jakub_Rzepka_TreeStructure_Core.ViewModels;

namespace Jakub_Rzepka_TreeStructure_Core.Controllers
{
    public class HomeController : Controller
    {
        private readonly INodeRepository _nodeRepository;

        public HomeController(INodeRepository nodeRepository)
        {
            _nodeRepository = nodeRepository;
        }



        public IActionResult Index()
        {
            return View();
        }

        public JsonResult GetNodes()
        {
            var nodes = _nodeRepository.GetAllNodes();
            return Json(nodes);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult AddNewNode(string name, int? parentId)
        {
            var newNodeId = _nodeRepository.AddNode(new NodeVM
            {
                Name = name,
                ParentNodeId = parentId,
            });

            return Json(new { success = true, nodeName = name, newNodeId, nodeParentId = parentId });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult DeleteNode(int id)
        {
            _nodeRepository.DeleteNode(id);
            return Json(new { success = true,  nodeId = id });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult EditNode(string name, int id, int? parentId)
        {
            _nodeRepository.EditNode(new NodeVM
            {
                Id = id,
                Name = name,
                ParentNodeId = parentId
            });
            return Json(new { success = true, nodeId = id });
        }
    }
}
