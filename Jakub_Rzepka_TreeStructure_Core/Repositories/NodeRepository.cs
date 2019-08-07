 using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jakub_Rzepka_TreeStructure_Core.DAL;
using Jakub_Rzepka_TreeStructure_Core.Models;
using Jakub_Rzepka_TreeStructure_Core.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Jakub_Rzepka_TreeStructure_Core.Repositories
{
    public class NodeRepository : INodeRepository
    {
        private readonly AppDbContext _appDbContext;

        public NodeRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public List<HomeVM> GetAllNodes()
        {
            var nodes = _appDbContext.Nodes.Select(n => new HomeVM
            {
                Id = n.Id,
                Name = n.Name,
                ParentNodeId = n.ParentNodeId,
                HasChildren = n.SubNodes.Any(),
                Index = n.Index

            }).OrderBy(n => n.Index).ToList();

            return nodes;
        }

        public int AddNode(NodeVM nodeVM)
        {
            var node = new Node
            {
                Name = nodeVM.Name,
                ParentNodeId = nodeVM.ParentNodeId
            };

            _appDbContext.Nodes.Add(node);
            _appDbContext.SaveChanges();

            return node.Id;
        }

        public void DeleteNode(int id)
        {
            DeleteNodesRecursively(id);
            _appDbContext.SaveChanges();
        }

        private void DeleteNodesRecursively(int id)
        {
            Node node = _appDbContext.Nodes.Include("SubNodes").Single(x => x.Id == id);
            _appDbContext.Nodes.Remove(node);

            foreach (var child in node.SubNodes)
                DeleteNodesRecursively(child.Id);
        }

        public void EditNode(NodeVM nodeVM)
        {
            Node node = _appDbContext.Nodes.Single(x => x.Id == nodeVM.Id);
            if (nodeVM.Name != null) node.Name = nodeVM.Name;
            if (nodeVM.ParentNodeId != null)
            {
                if (nodeVM.ParentNodeId == 0) node.ParentNodeId = null;
                else node.ParentNodeId = nodeVM.ParentNodeId;
            }

            _appDbContext.Update(node);
            _appDbContext.SaveChanges();
        }

        public void SortNode(List<SortVM> sortVm)
        {
            if (sortVm.Any())
            {
                Node node = new Node();
                foreach (var n in sortVm)
                {
                    node = _appDbContext.Nodes.Single(x => x.Id == n.NodeId);
                    node.Index = n.Index;

                    _appDbContext.Update(node);
                }
                _appDbContext.SaveChanges();
            }
        }
    }
}
